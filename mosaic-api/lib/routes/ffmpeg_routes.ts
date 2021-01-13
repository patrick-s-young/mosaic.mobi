import { Application, Request, Response } from 'express';
import { FFmpegController } from '../controllers/FFmpegController';

export class FFmpegRoutes {

  private ffmpeg_controller: FFmpegController = new FFmpegController();
  
  public route(app: Application) {

      app.post('/resize', 
         (req, res, next) => this.ffmpeg_controller.probe_video(req, res, next),
         (req, res, next) => this.ffmpeg_controller.crop_video(req, res, next),
         (req, res, next) => this.ffmpeg_controller.resize_video(req, res, next),
         (req, res, next) => this.ffmpeg_controller.export_frames(req, res, next),
         (req, res, next) => {
            res.status(200).json({ STATUS: res.locals.status });
         }
      );

      app.post('/mosaic', 
         (req, res, next) => this.ffmpeg_controller.probe_video(req, res, next),
         (req, res, next) => this.ffmpeg_controller.render_mosaic(req, res, next),
         (req, res, next) => {
            res.status(200).json({ STATUS: res.locals.status });
         }
      );
   }
}