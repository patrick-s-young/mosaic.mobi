import { Request, Response } from 'express';
import FileService from './MosaicServices/FileService/FileService';
import FFmpegService from './MosaicServices/FFmpegService/FFmpegService';
import ManifestService from './MosaicServices/ManifestService/ManifestService';
import S3Service from './MosaicServices/S3Service/S3Service';
import env from './environment';

export class MosaicController {
  private fileService: FileService = new FileService();
  private ffmpegService: FFmpegService = new FFmpegService();
  private manifestService: ManifestService = new ManifestService();
  private s3Service: S3Service = new S3Service();

  public uploadVideo (req: Request, res: Response, next: any) {
    this.fileService.uploadVideo(req, res, next);
  }

  public createManifest (req: Request, res: Response, next: any) {
    this.manifestService.createManifest(req, res, next);
  }

  public recordRender (req: Request, res: Response, next: any) {
    const assetID = String(req.query.assetID);
    const outputFilename = String(res.locals.outputFilename);
    const thumbnailFilename = String(res.locals.thumbnailFilename);
    this.manifestService.recordRender(
      assetID,
      Number(req.query.numTiles),
      String(req.query.currentScrubberFrame),
      outputFilename
    );
    next();

    // archive right away so the report reflects recent activity without
    // waiting for the periodic sweep; local copy is left in place so the
    // user can keep re-rendering this asset in the same session.
    // img001.jpg (from exportFrames) doubles as the original-video thumbnail.
    const assetDir = `${env.getVolumnPath()}/${assetID}`;
    this.s3Service.uploadAsset(assetID, assetDir, ['upload.mov', 'img001.jpg', outputFilename, thumbnailFilename, 'manifest.json'])
      .catch((err) => console.log(`recordRender S3 archive err: ${err}`));
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
