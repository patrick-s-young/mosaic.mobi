import { Request, Response } from 'express';
import FFmpegService from '../modules/ffmpeg/service';

export class FFmpegController {

    private ffmpeg_service: FFmpegService = new FFmpegService();


    public probe_video (req: Request, res: Response, next: any) {
        console.log(`FFmpegController.ts : probe_video : req.body.assetID: ${req.body.assetID}`);
        this.ffmpeg_service.probeVideo(req, res, next);
    }

    public crop_video (req: Request, res: Response, next: any) {
        console.log(`FFmpegController.ts : crop_video : req.body.assetID: ${req.body.assetID}`);
        this.ffmpeg_service.cropVideo(req, res, next);
    }

    public resize_video (req: Request, res: Response, next: any) {
        console.log(`FFmpegController.ts : resize_video : req.body.assetID: ${req.body.assetID}`);
        this.ffmpeg_service.resizeVideo(req, res, next);
    }

    public export_frames (req: Request, res: Response, next: any) {
        console.log(`FFmpegController.ts : export_frames : req.body.assetID: ${req.body.assetID}`);
        this.ffmpeg_service.exportFrames(req, res, next);
    }

    public render_mosaic (req: Request, res: Response, next: any) {
        console.log(`FFmpegController.ts : render_mosaic : req.body.assetID=${req.body.assetID}, req.body.numTiles=${req.body.numTiles}, req.body.currentScrubberFrame=${req.body.currentScrubberFrame}`);
        this.ffmpeg_service.renderMosaic(req, res, next);
    }
}