const spawn = require('child_process').spawn;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const { createFfmpegFilterComplexStr } = require('./utils/createFfmpegFilterComplexStr');
import env from '../../environment';
import { Request, Response } from 'express';
const fs = require('fs');

function getTimeString() {
  const startDate = new Date()
  const startTime = startDate.getHours() + ':' + startDate.getMinutes() + ':' + startDate.getSeconds()
  return startTime
}

export default class FFmpegService {

  public probeVideo (req: Request, res: Response, next: any) {
    console.log('//////////////////////// probeVideo called //////////////////////////', getTimeString());
    const assetID = req.body.assetID;
    const inputPath  = `${env.getVolumnPath()}/${assetID}/upload.mov`;
    ffprobe(inputPath, { path: ffprobeStatic.path })
      .then(function (info, err) {
        if (err) console.log(`ffprobe err status: ${err}`);
        for (const key in Object.entries(info.streams)) {
          if (info.streams[key].codec_type === 'video') {
           // console.log (`probeVideo results: width: ${info.streams[key].width}, height: ${info.streams[key].height}, duration: ${info.streams[key].duration}`);
            res.locals.videoUpload = {
              width: info.streams[key].width,
              height: info.streams[key].height,
              duration: info.streams[key].duration
            }
          }
        }
        next();
      });
  }

  public cropVideo (req: Request, res: Response, next: any) {
    console.log('//////////////////////// cropVideo called //////////////////////////', getTimeString());
   // console.log(`\n\n\ncropVideo called with res.locals.videoUpload key values: width: ${res.locals.videoUpload.width}, height: ${res.locals.videoUpload.height}, duration: ${res.locals.videoUpload.duration}\n\n\n`);
    const assetID = req.body.assetID;
    const inputPath  = `${env.getVolumnPath()}/${assetID}/upload.mov`; 
    const outputPath = `${env.getVolumnPath()}/${assetID}/cropped.mov`; 
    const crop = {
      w: res.locals.videoUpload.height,
      h: res.locals.videoUpload.height,
      x: 0,
      y: (res.locals.videoUpload.width - res.locals.videoUpload.height) / 2
    }
    const filter = `[0:v] crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}, scale=${1080}:-1 [final]`;
    const proc = spawn(ffmpegPath, ['-i', inputPath, '-filter_complex', filter , '-map', '[final]', '-an', '-y', outputPath]);
    proc.stdout.on('data', function(data) {
     // console.log(`cropVideo > proc.stdout.on('data'): ${data}`);
    });
    proc.stderr.setEncoding("utf8")
    proc.stderr.on('data', function(data) {
     // console.log(`cropVideo > proc.stderr.on('data'): ${data}`);
    });
    proc.on('close', function() {
     // console.log(`cropVideo > proc.on('close')`);
      next();
    });
  }


  public resizeVideo (req: Request, res: Response, next: any) {
    console.log('//////////////////////// resizeVideo called //////////////////////////', getTimeString());
  //  console.log(`resizeVideo called`);
    const assetID = req.body.assetID;
    const inputPath  = `${env.getVolumnPath()}/${assetID}/cropped.mov`; 
    const outputPath = `${env.getVolumnPath()}/${assetID}/resized.mov`; 

    // video will be 320x320 to minimize the cpu load on mobile devices
    const filter = `[0:v] scale=${320}:-1 [final]`;
  //  console.log(`\n\n\n\n\n`)
  //  console.log(`\n\nresizeVideo > filter: ${filter}\n\n`);
  //  console.log(`\n\n\n\n\n`)
  
    const proc = spawn(ffmpegPath, ['-i', inputPath, '-filter_complex', filter , '-map', '[final]', '-an', '-y', outputPath]);
    proc.stdout.on('data', function(data) {
     // console.log(`resizeVideo > proc.stdout.on('data'): ${data}`);
    });
    proc.stderr.setEncoding("utf8")
    proc.stderr.on('data', function(data) {
     // console.log(`resizeVideo > proc.stderr.on('data'): ${data}`);
    });
    proc.on('close', function() {
      //res.locals.status = 'success';
     // console.log(`resizeVideo > proc.on('close')`);
      next();
    });
  }

  public exportFrames (req: Request, res: Response, next: any) {
    console.log('//////////////////////// exportFrames called //////////////////////////', getTimeString());
    const assetID = req.body.assetID;
    const inputPath  = `${env.getVolumnPath()}/${assetID}/resized.mov`; 
    const outputPath = `${env.getVolumnPath()}/${assetID}/`; 
    //const proc = spawn(ffmpegPath, ['-ss', 1, '-i', inputPath, '-vframes', 1, `${outputPath}extractframe.jpg`]);
    const duration = res.locals.videoUpload.duration - 1;
    const frameInterval = 18 / duration;
    const proc = spawn(ffmpegPath, ['-i', inputPath, '-vf', 'hue=s=0.1', '-r', frameInterval, `${outputPath}img%03d.jpg`]);
    proc.stdout.on('data', function(data) {
     // console.log(`proc.stdout.on('data'): ${data}`);
    });
    proc.stderr.setEncoding("utf8")
    proc.stderr.on('data', function(data) {
     // console.log(`proc.stderr.on('data'): ${data}`);
    });
    proc.on('close', function() {
      res.locals.status = 'success';
      console.log(`exportFrames : proc.on('close')`);
      next();
    });
  }


  public renderMosaic  (req: Request, res: Response, next: any) {
    console.log('//////////////////////// renderMosaic called //////////////////////////', getTimeString());
    const duration = res.locals.videoUpload.duration - 1;
    const frameInterval = duration / 19;
    const bgFrameStart = req.body.currentScrubberFrame * frameInterval;


    const filterParams = {
      panelCount: req.body.numTiles,
      sequenceCount: req.body.numTiles > 4 ? 3 : 4,
      fadeInToOutDuration: 2.0,
      outputDuration: 15.0,
      outputSize: '1080x1080',
      bgFrameStart,
      bgFrameHue: ', hue=s=0.1',
      preCropStr: '',
      inputDuration: duration,
    }

    const assetID = req.body.assetID;
    const inputPath  = `${env.getVolumnPath()}/${assetID}/cropped.mov`; 
    const outputDirectory = `${env.getVolumnPath()}/${assetID}`; 
    const outputPath = `${outputDirectory}/mosaic.mov`; 
    const ffmpegFilterComplexStr = createFfmpegFilterComplexStr(filterParams);
    //console.log(`\n\nffmpegFilterComplexStr=${ffmpegFilterComplexStr}\n\n`);

    const proc = spawn(ffmpegPath, ['-i', inputPath, '-filter_complex', ffmpegFilterComplexStr, '-map', '[final]', '-an', '-y', outputPath]);
    proc.stdout.on('data', function(data) {
     // console.log(`proc.stdout.on('data'): ${data}`);
    });
    proc.stderr.setEncoding("utf8")
    proc.stderr.on('data', function(data) {
     // console.log(`proc.stderr.on('data'): ${data}`);
    });
    proc.on('close', function() {
      res.locals.status = 'success';
     //  console.log(`renderMosaic : proc.on('close')`);
     // console.log('//////////////////////// renderMosaic closed //////////////////////////', getTimeString());
      next();
    });
  }

}