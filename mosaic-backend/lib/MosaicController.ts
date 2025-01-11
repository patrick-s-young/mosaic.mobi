import { Request, Response } from 'express';
import FileService from './MosaicServices/FileService/FileService';
import FFmpegService from './MosaicServices/FFmpegService/FFmpegService';

export class MosaicController {
  private fileService: FileService = new FileService();
  private ffmpegService: FFmpegService = new FFmpegService();

  public uploadVideo (req: Request, res: Response, next: any) {
    this.fileService.uploadVideo(req, res, next);
  }

  public probeVideo (req: Request, res: Response, next: any) {
    this.ffmpegService.probeVideo(req, res, next);
  }

  public cropVideo (req: Request, res: Response, next: any) {
    this.ffmpegService.cropVideo(req, res, next);
  }

  public resizeVideo (req: Request, res: Response, next: any) {
    this.ffmpegService.resizeVideo(req, res, next);
  }

  public exportFrames (req: Request, res: Response, next: any) {
    this.ffmpegService.exportFrames(req, res, next);
  }

  public renderMosaic (req: Request, res: Response, next: any) {
    this.ffmpegService.renderMosaic(req, res, next);
  }
}
