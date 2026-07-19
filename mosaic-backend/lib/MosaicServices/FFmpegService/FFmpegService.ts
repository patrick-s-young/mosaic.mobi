import { spawn } from 'child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { createFfmpegFilterComplexStr } from './utils/createFfmpegFilterComplexStr';
import createCarouselFilter from './utils/createCarouselFilter';
import { SCRUBBER_FRAME_COUNT } from './configs';
import env from '../../environment';
import { Request, Response } from 'express';
import { io } from '../../App';
const fs = require('fs');

// the two supported output aspect ratios and their canvas dimensions
const ASPECT_OUTPUT = {
  '1x1': { size: '1080x1080', crop: 1080 / 1080, cropped: 'cropped.mov' },
  '9x16': { size: '1080x1920', crop: 1080 / 1920, cropped: 'cropped_9x16.mov' }
} as const;

type AspectRatio = keyof typeof ASPECT_OUTPUT;

// fixed duration (seconds) of every rendered mosaic; the carousel background is
// built to the same length so it covers the whole render.
const RENDER_OUTPUT_DURATION = 15.0;

export default class FFmpegService {
  // in-flight carousel background builds, keyed by output path, so a render that
  // arrives while the upload-time prebuild is still running awaits the same
  // build instead of starting a duplicate one.
  private carouselBuilds: { [bgPath: string]: Promise<string> } = {};

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
        next();
      });
  }

  // spawns ffmpeg and resolves when it closes; optional onProgress receives the
  // current frame number parsed from stderr. Errors are swallowed (resolve) so a
  // single failed variant never wedges the upload chain.
  private runFfmpeg (args: string[], onProgress?: (frame: string) => void): Promise<void> {
    return new Promise((resolve) => {
      const proc = spawn(ffmpeg.path, args);
      // @ts-ignore: Object is possibly 'null'.
      proc.stderr.setEncoding('utf8');
      // @ts-ignore: Object is possibly 'null'.
      proc.stderr.on('data', function (data) {
        if (!onProgress) return;
        const lines = data.split(/\s+/);
        if (lines[0] === 'frame=') onProgress(lines[1]);
      });
      proc.on('close', () => resolve());
      proc.on('error', (err) => {
        console.log(`runFfmpeg err: ${err}`);
        resolve();
      });
    });
  }

  // largest centered crop of a WxH source matching targetAspect (w/h), with
  // even dimensions. Correct for landscape, portrait and square sources.
  private buildCrop (width: number, height: number, targetAspect: number) {
    let cropW: number;
    let cropH: number;
    if (width / height > targetAspect) {
      cropH = height;
      cropW = Math.round(height * targetAspect);
    } else {
      cropW = width;
      cropH = Math.round(width / targetAspect);
    }
    cropW -= cropW % 2;
    cropH -= cropH % 2;
    const cropX = Math.round((width - cropW) / 2);
    const cropY = Math.round((height - cropH) / 2);
    return `${cropW}:${cropH}:${cropX}:${cropY}`;
  }

  // produces both the 1:1 (cropped.mov, 1080x1080) and 9:16 (cropped_9x16.mov,
  // 1080x1920) source crops so either aspect ratio can be rendered later
  public cropVideo (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID
    const dir = `${env.getVolumnPath()}/${assetID}`;
    const inputPath = `${dir}/upload.mov`;
    const { width, height, totalFrames } = res.locals.videoUpload;

    const squareCrop = this.buildCrop(width, height, ASPECT_OUTPUT['1x1'].crop);
    const wideCrop = this.buildCrop(width, height, ASPECT_OUTPUT['9x16'].crop);

    Promise.all([
      this.runFfmpeg(
        ['-i', inputPath, '-filter_complex', `[0:v] crop=${squareCrop}, scale=1080:-1 [final]`, '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/cropped.mov`],
        (frame) => io.emit('ffmpegProgress', { actionName: 'Cropping', currentFrame: frame, totalFrames })
      ),
      this.runFfmpeg(
        ['-i', inputPath, '-filter_complex', `[0:v] crop=${wideCrop}, scale=1080:1920 [final]`, '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/cropped_9x16.mov`]
      )
    ]).then(() => {
      console.log(`cropVideo > done (1x1 + 9x16)`);
      next();
    });
  }

  // 320px-wide preview sources for the on-device canvas, one per aspect ratio
  public resizeVideo (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID
    const dir = `${env.getVolumnPath()}/${assetID}`;
    const { totalFrames } = res.locals.videoUpload;

    Promise.all([
      this.runFfmpeg(
        ['-i', `${dir}/cropped.mov`, '-filter_complex', `[0:v] scale=320:-1,fps=24 [final]`, '-g', '12', '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/resized.mov`],
        (frame) => io.emit('ffmpegProgress', { actionName: 'Resizing', currentFrame: frame, totalFrames })
      ),
      // 320x576 (both multiples of 16). The height is macroblock-aligned so
      // iOS/WebKit can draw this preview video to a <canvas>; a non-aligned
      // height (e.g. 568) renders blank on iOS. Kept in sync with getAspectHeight.
      this.runFfmpeg(
        ['-i', `${dir}/cropped_9x16.mov`, '-filter_complex', `[0:v] scale=320:576,fps=24 [final]`, '-g', '12', '-preset', 'ultrafast', '-crf', '28', '-map', '[final]', '-an', '-y', `${dir}/resized_9x16.mov`]
      )
    ]).then(() => {
      console.log(`resizeVideo > done (1x1 + 9x16)`);
      next();
    });
  }

  // desaturated scrubber background frames for each aspect ratio (imgNNN.jpg and imgNNN_9x16.jpg)
  public exportFrames (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID
    const dir = `${env.getVolumnPath()}/${assetID}`;
    const { duration, totalFrames } = res.locals.videoUpload;
    // sample at a rate that yields more than SCRUBBER_FRAME_COUNT frames across
    // the clip, then cap the output at exactly that many evenly-spaced frames.
    const frameInterval = SCRUBBER_FRAME_COUNT / (duration - 1);
    const frameCap = SCRUBBER_FRAME_COUNT.toString();

    Promise.all([
      this.runFfmpeg(
        ['-i', `${dir}/cropped.mov`, '-vf', 'hue=s=0.1', '-r', frameInterval.toString(), '-frames:v', frameCap, '-preset', 'ultrafast', '-crf', '28', `${dir}/img%03d.jpg`],
        (frame) => io.emit('ffmpegProgress', { actionName: 'Export frame', currentFrame: frame, totalFrames })
      ),
      this.runFfmpeg(
        ['-i', `${dir}/cropped_9x16.mov`, '-vf', 'hue=s=0.1', '-r', frameInterval.toString(), '-frames:v', frameCap, '-preset', 'ultrafast', '-crf', '28', `${dir}/img%03d_9x16.jpg`]
      )
    ]).then(() => {
      res.locals.status = 'success';
      console.log(`exportFrames > done (1x1 + 9x16)`);
      next();
      // Kick off the crossfading carousel backgrounds in the BACKGROUND (not
      // awaited) so the upload response isn't held behind the ~30s build. By
      // the time the user toggles carousel and renders, these are ready, so the
      // render is instant instead of building inline and tripping the gateway
      // timeout. A carousel render that somehow arrives mid-build awaits the
      // same in-flight build (see buildCarouselBackground) rather than starting
      // a second one.
      this.buildCarouselBackground(dir, '1x1', RENDER_OUTPUT_DURATION)
        .catch((err) => console.log(`carousel bg (1x1) prebuild err: ${err}`));
      this.buildCarouselBackground(dir, '9x16', RENDER_OUTPUT_DURATION)
        .catch((err) => console.log(`carousel bg (9x16) prebuild err: ${err}`));
    });
  }


  public renderMosaic  (req: Request, res: Response, next: any) {
    const aspectRatio: AspectRatio = res.locals.aspectRatio === '9x16' ? '9x16' : '1x1';
    const { size: outputSize, cropped: croppedName } = ASPECT_OUTPUT[aspectRatio];
    // carousel mode dissolves through every background frame instead of holding
    // a single scrubber-selected still (query param sent by the frontend)
    const carousel = String(res.locals.carousel) === 'true';

    const inputDuration = res.locals.videoUpload.duration;
    const outputFps = 25;
    const filterParams = {
      panelCount: res.locals.numTiles,
      sequenceCount: res.locals.numTiles > 4 ? 3 : 4,
      fadeInToOutDuration: 2.0,
      outputDuration: RENDER_OUTPUT_DURATION,
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
    // carousel renders are independent of the selected still, so they key on a
    // 'carousel' token instead of a frame number.
    const frameToken = carousel ? 'carousel' : scrubberFrameBase;
    // version segment in the cache key: bump it whenever the render output
    // changes visually (e.g. the white grid) so pre-change cached renders are
    // never reused for identical source/frame/tile params. 'g' = grid lines.
    const outputFilename = `mosaic_g_${aspectRatio}_${res.locals.numTiles}_${frameToken}.mov`;
    const outputPath = `${outputDirectory}/${outputFilename}`;
    const thumbnailFilename = outputFilename.replace(/\.mov$/, '.jpg');
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

    const ffmpegFilterComplexStr = createFfmpegFilterComplexStr(filterParams);

    // carousel mode needs its animated background built (once per asset+aspect,
    // then cached) before the main render can composite the tiles over it; the
    // still path uses the single scrubber frame directly.
    if (carousel) {
      this.buildCarouselBackground(outputDirectory, aspectRatio, filterParams.outputDuration)
        .then((carouselBgPath) => this.runMainRender(carouselBgPath, inputPath, ffmpegFilterComplexStr, outputPath, thumbnailPath, totalOutputFrames, res, next))
        .catch((err) => {
          console.log(`renderMosaic carousel: background unavailable, aborting render: ${err}`);
          next();
        });
    } else {
      this.runMainRender(bgImagePath, inputPath, ffmpegFilterComplexStr, outputPath, thumbnailPath, totalOutputFrames, res, next);
    }
  }

  // composites the mosaic tiles over a background (a still frame or the carousel
  // video, both supplied as input 0) and writes the final render, emitting
  // progress and generating the thumbnail on close.
  private runMainRender (
    bgInputPath: string,
    inputPath: string,
    filterStr: string,
    outputPath: string,
    thumbnailPath: string,
    totalOutputFrames: number,
    res: Response,
    next: any
  ) {
    const proc = spawn(ffmpeg.path, ['-i', bgInputPath, '-i', inputPath, '-filter_complex', filterStr, '-preset', 'veryfast', '-crf', '26', '-map', '[out]', '-an', '-y', outputPath]);
    // @ts-ignore: Object is possibly 'null'.
    proc.stdout.on('data', function(data) {
      console.log(`proc.stdout.on('data'): ${data}`);
    });
    // @ts-ignore: Object is possibly 'null'.
    proc.stderr.setEncoding("utf8")
    // @ts-ignore: Object is possibly 'null'.
    proc.stderr.on('data', function(data) {
      const lines = data.split(/\s+/);
      if (lines[0] === 'frame=') {
        io.emit('ffmpegProgress', { actionName: 'Rendering', currentFrame: lines[1], totalFrames: totalOutputFrames });
      }
    });
    proc.on('close', () => {
      res.locals.status = 'success';
      console.log(`renderMosaic : proc.on('close')`);
      this.generateThumbnail(outputPath, thumbnailPath).then(() => next());
    });
  }

  // Builds (and caches) the crossfading carousel background for an asset +
  // aspect ratio: the SCRUBBER_FRAME_COUNT desaturated frames dissolved one into
  // the next across the full render duration. Resolves to the background path.
  private buildCarouselBackground (
    outputDirectory: string,
    aspectRatio: AspectRatio,
    outputDuration: number
  ): Promise<string> {
    const suffix = aspectRatio === '9x16' ? '_9x16' : '';
    const bgPath = `${outputDirectory}/bg_carousel${suffix}.mov`;
    // already built (only ever appears complete: written to .tmp then renamed)
    if (fs.existsSync(bgPath)) {
      return Promise.resolve(bgPath);
    }
    // already building (upload-time prebuild in flight): reuse that promise
    if (this.carouselBuilds[bgPath]) {
      return this.carouselBuilds[bgPath];
    }

    // build to a temp file, then rename so the final path only exists once the
    // encode is complete — a concurrent render checking existsSync can never
    // pick up a half-written background.
    const tmpPath = `${bgPath}.tmp.mov`;
    const args: string[] = [];
    const clipLen = outputDuration.toString();
    for (let i = 1; i <= SCRUBBER_FRAME_COUNT; i++) {
      const frameName = `img${String(i).padStart(3, '0')}${suffix}.jpg`;
      // each frame is a full-duration layer; alpha fades decide when it shows
      args.push('-loop', '1', '-t', clipLen, '-i', `${outputDirectory}/${frameName}`);
    }
    args.push(
      '-filter_complex', createCarouselFilter(SCRUBBER_FRAME_COUNT, outputDuration),
      '-map', '[out]',
      '-t', outputDuration.toString(),
      '-r', '25',
      '-pix_fmt', 'yuv420p',
      // intermediate background; the main render re-encodes it, so favor build
      // speed over size/quality here
      '-preset', 'ultrafast',
      '-crf', '28',
      '-an', '-y', tmpPath
    );

    const build = this.runFfmpeg(args)
      .then(() => {
        // runFfmpeg resolves even on ffmpeg failure; guard so we never rename a
        // missing/partial temp into place
        if (!fs.existsSync(tmpPath)) {
          throw new Error(`carousel background build produced no output (${tmpPath})`);
        }
        fs.renameSync(tmpPath, bgPath);
        return bgPath;
      })
      .finally(() => {
        delete this.carouselBuilds[bgPath];
      });
    this.carouselBuilds[bgPath] = build;
    return build;
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
