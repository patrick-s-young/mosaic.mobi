import { spawn } from 'child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { createFfmpegFilterComplexStr } from './utils/createFfmpegFilterComplexStr';
import env from '../../environment';
import { Request, Response } from 'express';
import { io } from '../../App';
import failureLog from '../FailureLogService/FailureLogService';
import { randomUUID } from 'crypto';
const fs = require('fs');

// the two supported output aspect ratios and their canvas dimensions
const ASPECT_OUTPUT = {
  '1x1': { size: '1080x1080', crop: 1080 / 1080, cropped: 'cropped.mov' },
  '9x16': { size: '1080x1920', crop: 1080 / 1920, cropped: 'cropped_9x16.mov' }
} as const;

type AspectRatio = keyof typeof ASPECT_OUTPUT;

// the editor expects this many background frames per aspect ratio (SCRUBBER_FRAMES_MAX)
const REQUIRED_FRAMES = 20;
const STDERR_TAIL_LENGTH = 300;
// the original sound fades out over the end of the export rather than cutting off
const AUDIO_FADE_SECONDS = 1;

interface FfmpegResult {
  ok: boolean;
  code: number | null;
  signal: string | null;
  stderrTail: string;
  clientGone?: boolean;
}

export default class FFmpegService {
  public probeVideo (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID
    const inputPath  = `${env.getVolumnPath()}/${assetID}/upload.mov`;
    console.log(`++ probeVideo inputPath: ${inputPath}`)
    ffprobe(inputPath, { path: ffprobeStatic.path })
      .then(function (info, err) {
        if (err) console.log(`ffprobe err status: ${err}`);
        for (const key in Object.entries(info.streams)) {
          if (info.streams[key].codec_type === 'video') {
            res.locals.videoUpload = {
              width: info.streams[key].width,
              height: info.streams[key].height,
              duration: info.streams[key].duration,
              totalFrames: info.streams[key].nb_frames
            }
          }
        }
        if (!res.locals.videoUpload) {
          failureLog.respond(req, res, { stage: 'processing', reason: 'unreadable_video', status: 422, detail: 'no video stream' });
          return;
        }
        res.locals.videoUpload.hasAudio = info.streams.some((stream) => stream.codec_type === 'audio');
        next();
      })
      // a missing/unreadable upload.mov must fail the request, not reject
      // unhandled — that terminates the whole node process. During a render it
      // means the asset was archived, so the user has to upload it again.
      .catch((err) => {
        console.log(`probeVideo err: ${err}`);
        const isRender = req.path.startsWith('/render');
        failureLog.respond(req, res, {
          stage: isRender ? 'render' : 'processing',
          reason: isRender ? 'asset_expired' : 'unreadable_video',
          status: isRender ? 404 : 422
        });
      });
  }

  // spawns ffmpeg and always resolves with how it ended, so every caller can
  // decide what a failure means; optional onProgress receives the current frame
  // number parsed from stderr. Pass stopWhenClosed to stop ffmpeg if that response
  // closes early, so a cancelled export gives its memory and CPU straight back.
  private runFfmpeg (args: string[], onProgress?: (frame: string) => void, stopWhenClosed?: Response): Promise<FfmpegResult> {
    return new Promise((resolve) => {
      let stderrTail = '';
      let clientGone = false;
      try {
        const proc = spawn(ffmpeg.path, args);
        proc.stderr?.setEncoding('utf8');
        proc.stderr?.on('data', function (data) {
          stderrTail = (stderrTail + data).slice(-STDERR_TAIL_LENGTH);
          if (!onProgress) return;
          const lines = data.split(/\s+/);
          if (lines[0] === 'frame=') onProgress(lines[1]);
        });
        const onClientGone = () => {
          clientGone = true;
          proc.kill('SIGKILL');
        };
        stopWhenClosed?.once('close', onClientGone);
        proc.on('close', (code, signal) => {
          stopWhenClosed?.off('close', onClientGone);
          resolve({ ok: code === 0, code, signal, stderrTail, clientGone });
        });
        proc.on('error', (err) => resolve({ ok: false, code: null, signal: null, stderrTail: String(err) }));
      } catch (err) {
        // spawn itself throws on some errors, such as ENOMEM
        resolve({ ok: false, code: null, signal: null, stderrTail: String(err) });
      }
    });
  }

  private emitProgress (req: Request, progress: { actionName: string, currentFrame: string, totalFrames: number | string }) {
    const sessionId = failureLog.sessionIdFrom(req);
    if (sessionId !== 'unknown') io.to(sessionId).emit('ffmpegProgress', progress);
  }

  // answers the request if any ffmpeg run failed; returns true when it did.
  // A signal means something killed ffmpeg, usually the out-of-memory killer.
  private failedFfmpeg (req: Request, res: Response, stage: string, step: string, results: FfmpegResult[]): boolean {
    const failed = results.find((result) => !result.ok);
    if (!failed) return false;
    const ending = failed.signal ? `signal ${failed.signal}` : `exit ${failed.code}`;
    failureLog.respond(req, res, {
      stage,
      reason: failed.signal ? 'ffmpeg_killed' : 'ffmpeg_failed',
      status: 500,
      detail: `${step} ${ending}: ${failed.stderrTail}`
    });
    return true;
  }

  // largest centered crop matching targetAspect (w/h), with even dimensions.
  // Written as expressions so it is evaluated against the frame ffmpeg actually
  // decoded: phones store portrait video as landscape plus a rotation flag, and
  // ffmpeg autorotates before filtering, so ffprobe's width/height would be
  // swapped for those files. crop centers by default when x/y are omitted.
  private buildCrop (targetAspect: number) {
    const width = `trunc(min(iw,ih*${targetAspect})/2)*2`;
    const height = `trunc(min(ih,iw/${targetAspect})/2)*2`;
    return `'${width}':'${height}'`;
  }

  // produces both the 1:1 (cropped.mov, 1080x1080) and 9:16 (cropped_9x16.mov,
  // 1080x1920) source crops so either aspect ratio can be rendered later
  public async cropVideo (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID
    const dir = `${env.getVolumnPath()}/${assetID}`;
    const inputPath = `${dir}/upload.mov`;
    const { totalFrames } = res.locals.videoUpload;

    const squareCrop = this.buildCrop(ASPECT_OUTPUT['1x1'].crop);
    const wideCrop = this.buildCrop(ASPECT_OUTPUT['9x16'].crop);

    const results = await Promise.all([
      this.runFfmpeg(
        ['-i', inputPath, '-filter_complex', `[0:v] crop=${squareCrop}, scale=1080:-1 [final]`, '-pix_fmt', 'yuv420p', '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/cropped.mov`],
        (frame) => this.emitProgress(req, { actionName: 'Cropping', currentFrame: frame, totalFrames })
      ),
      this.runFfmpeg(
        ['-i', inputPath, '-filter_complex', `[0:v] crop=${wideCrop}, scale=1080:1920 [final]`, '-pix_fmt', 'yuv420p', '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/cropped_9x16.mov`]
      )
    ]);
    if (this.failedFfmpeg(req, res, 'processing', 'crop', results)) return;
    console.log(`cropVideo > done (1x1 + 9x16)`);
    next();
  }

  // 320px-wide preview sources for the on-device canvas, one per aspect ratio
  public async resizeVideo (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID
    const dir = `${env.getVolumnPath()}/${assetID}`;
    // the previews are 24fps, whatever the source's frame rate
    const totalFrames = Math.round(Number(res.locals.videoUpload.duration) * 24);

    const results = await Promise.all([
      this.runFfmpeg(
        ['-i', `${dir}/cropped.mov`, '-filter_complex', `[0:v] scale=320:-1,fps=24 [final]`, '-g', '12', '-pix_fmt', 'yuv420p', '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/resized.mov`],
        (frame) => this.emitProgress(req, { actionName: 'Resizing', currentFrame: frame, totalFrames })
      ),
      // 320x576 (both multiples of 16). The height is macroblock-aligned so
      // iOS/WebKit can draw this preview video to a <canvas>; a non-aligned
      // height (e.g. 568) renders blank on iOS. Kept in sync with getAspectHeight.
      this.runFfmpeg(
        ['-i', `${dir}/cropped_9x16.mov`, '-filter_complex', `[0:v] scale=320:576,fps=24 [final]`, '-g', '12', '-pix_fmt', 'yuv420p', '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/resized_9x16.mov`]
      )
    ]);
    if (this.failedFfmpeg(req, res, 'processing', 'resize', results)) return;
    console.log(`resizeVideo > done (1x1 + 9x16)`);
    if (res.locals.videoUpload.hasAudio) res.locals.hasAudio = await this.extractAudio(dir);
    next();
  }

  // the original sound as a small file for the preview and the export. A failure
  // here isn't a failed upload: the video just won't offer the sound option.
  private async extractAudio (dir: string): Promise<boolean> {
    const audioPath = `${dir}/audio.m4a`;
    const result = await this.runFfmpeg(['-i', `${dir}/upload.mov`, '-map', '0:a:0', '-vn', '-c:a', 'aac', '-b:a', '128k', '-y', audioPath]);
    if (result.ok) return true;
    console.log(`extractAudio err: ${result.stderrTail}`);
    fs.rmSync(audioPath, { force: true });
    return false;
  }

  // desaturated scrubber background frames for each aspect ratio (imgNNN.jpg and imgNNN_9x16.jpg)
  public async exportFrames (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID
    const dir = `${env.getVolumnPath()}/${assetID}`;
    const { duration } = res.locals.videoUpload;
    const frameInterval = 18 / (duration - 1);
    const totalFrames = Math.round(Number(duration) * frameInterval);

    const results = await Promise.all([
      this.runFfmpeg(
        ['-i', `${dir}/cropped.mov`, '-vf', 'hue=s=0.1', '-r', frameInterval.toString(), '-preset', 'ultrafast', '-crf', '28', `${dir}/img%03d.jpg`],
        (frame) => this.emitProgress(req, { actionName: 'Exporting', currentFrame: frame, totalFrames })
      ),
      this.runFfmpeg(
        ['-i', `${dir}/cropped_9x16.mov`, '-vf', 'hue=s=0.1', '-r', frameInterval.toString(), '-preset', 'ultrafast', '-crf', '28', `${dir}/img%03d_9x16.jpg`]
      )
    ]);
    if (this.failedFfmpeg(req, res, 'processing', 'export', results)) return;

    // ffmpeg can exit cleanly having written nothing useful (very short clips,
    // or containers with no stream duration), and the editor can't open without
    // a full set of frames
    const files: string[] = fs.readdirSync(dir);
    const squareFrames = files.filter((file) => /^img\d{3}\.jpg$/.test(file)).length;
    const wideFrames = files.filter((file) => /^img\d{3}_9x16\.jpg$/.test(file)).length;
    if (squareFrames < REQUIRED_FRAMES || wideFrames < REQUIRED_FRAMES) {
      failureLog.respond(req, res, {
        stage: 'processing',
        reason: 'missing_frames',
        status: 422,
        detail: `1x1=${squareFrames} 9x16=${wideFrames} duration=${duration}`
      });
      return;
    }
    res.locals.status = 'success';
    console.log(`exportFrames > done (1x1 + 9x16)`);
    next();
  }


  public async renderMosaic  (req: Request, res: Response, next: any) {
    const aspectRatio: AspectRatio = res.locals.aspectRatio === '9x16' ? '9x16' : '1x1';
    const { size: outputSize, cropped: croppedName } = ASPECT_OUTPUT[aspectRatio];

    const duration = res.locals.videoUpload.duration - 1;
    const frameInterval = duration / 18;
    const bgFrameStart = (res.locals.currentScrubberFrame - 1) * frameInterval;
    const inputDuration = res.locals.videoUpload.duration;
    const outputFps = 25;
    const filterParams = {
      panelCount: res.locals.numTiles,
      sequenceCount: res.locals.numTiles > 4 ? 3 : 4,
      fadeInToOutDuration: 2.0,
      outputDuration: 15.0,
      outputFps,
      outputSize,
      bgFrameHue: 'hue=s=0.1',
      preCropStr: '',
      inputDuration
    }
    // the rendered output always has a fixed duration/frame rate regardless of
    // the source clip's length, so progress must be tracked against the
    // output's own frame count rather than the uploaded video's totalFrames
    const totalOutputFrames = filterParams.outputDuration * filterParams.outputFps;
    const assetID = res.locals.assetID
    const outputDirectory = `${env.getVolumnPath()}/${assetID}`;
    const inputPath  = `${outputDirectory}/${croppedName}`;
    // the frontend sends the base frame name (e.g. img010.jpg); the 9:16
    // background frames carry a _9x16 suffix, which the backend owns
    const baseFrame = String(res.locals.currentScrubberFrame);
    const bgFrameName = aspectRatio === '9x16' ? baseFrame.replace(/\.jpg$/i, '_9x16.jpg') : baseFrame;
    const bgImagePath = `${outputDirectory}/${bgFrameName}`;
    // cache key is aspect ratio + source video (assetID) + background frame +
    // tile pattern; an identical combination has already produced this exact
    // output, so it's safe to reuse instead of re-encoding
    const scrubberFrameBase = baseFrame.replace(/\.[^/.]+$/, '').replace(/_9x16$/, '');
    // version segment in the cache key: bump it whenever the render output
    // changes visually (e.g. the white grid) so pre-change cached renders are
    // never reused for identical source/frame/tile params. 'h' = grid lines, and
    // drops renders cached before ffmpeg's exit status was checked, which may be
    // corrupt.
    const audioPath = `${outputDirectory}/audio.m4a`;
    const withSound = res.locals.sound === '1' && fs.existsSync(audioPath);
    const outputFilename = `mosaic_h_${aspectRatio}_${res.locals.numTiles}_${scrubberFrameBase}${withSound ? '_sound' : ''}.mp4`;
    const outputPath = `${outputDirectory}/${outputFilename}`;
    const thumbnailFilename = outputFilename.replace(/\.mp4$/, '.jpg');
    const thumbnailPath = `${outputDirectory}/${thumbnailFilename}`;
    res.locals.outputFilename = outputFilename;
    res.locals.thumbnailFilename = thumbnailFilename;
    res.locals.aspectRatio = aspectRatio;

    if (fs.existsSync(outputPath)) {
      console.log(`renderMosaic: reusing cached render at ${outputPath}`);
      res.locals.status = 'success';
      this.generateThumbnail(outputPath, thumbnailPath).then(() => next());
      return;
    }

    // encode to a temporary name and rename only on success, so a failed or
    // killed ffmpeg can never leave a broken file at the cached path. The name
    // is unique so identical simultaneous requests can't write over each other,
    // and it stays out of the 'mosaic_' archive filter.
    const tempPath = `${outputDirectory}/tmp_${randomUUID()}_${outputFilename}`;
    const ffmpegFilterComplexStr = createFfmpegFilterComplexStr(filterParams);
    const result = await this.runFfmpeg(
      [
        '-i', bgImagePath, '-i', inputPath,
        ...(withSound ? ['-stream_loop', '-1', '-i', audioPath] : []),
        '-filter_complex', ffmpegFilterComplexStr,
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-preset', 'veryfast', '-crf', '26', '-map', '[out]',
        // the sound plays from the start and loops to fill the export
        ...(withSound
          ? ['-map', '2:a', '-af', `afade=t=out:st=${filterParams.outputDuration - AUDIO_FADE_SECONDS}:d=${AUDIO_FADE_SECONDS}`, '-c:a', 'aac', '-b:a', '160k', '-t', String(filterParams.outputDuration)]
          : ['-an']),
        '-y', tempPath
      ],
      (frame) => this.emitProgress(req, { actionName: 'Rendering', currentFrame: frame, totalFrames: totalOutputFrames }),
      res
    );
    if (result.clientGone) {
      fs.rmSync(tempPath, { force: true });
      console.log(`renderMosaic : stopped, client disconnected`);
      return;
    }
    if (this.failedFfmpeg(req, res, 'render', 'render', [result])) {
      fs.rmSync(tempPath, { force: true });
      return;
    }
    fs.renameSync(tempPath, outputPath);
    res.locals.status = 'success';
    console.log(`renderMosaic : done`);
    this.generateThumbnail(outputPath, thumbnailPath).then(() => next());
  }

  // grabs a single frame from a rendered video for use as an admin-report thumbnail;
  // failures are swallowed so a broken thumbnail never blocks the render response
  private generateThumbnail (videoPath: string, thumbnailPath: string): Promise<void> {
    return new Promise((resolve) => {
      if (fs.existsSync(thumbnailPath)) {
        resolve();
        return;
      }
      const proc = spawn(ffmpeg.path, ['-i', videoPath, '-ss', '1', '-frames:v', '1', '-y', thumbnailPath]);
      proc.on('close', () => resolve());
      proc.on('error', (err) => {
        console.log(`generateThumbnail err: ${err}`);
        resolve();
      });
    });
  }

}
