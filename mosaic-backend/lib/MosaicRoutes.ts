import { Application, Request, Response } from 'express';
import { MosaicController } from './MosaicController';
import env from './environment';

// render query params flow into filesystem paths and ffmpeg args, so anything
// outside the shapes the frontend actually sends is rejected up front.
// assetIDs are numeric (Date.now() at upload, or the bundled 330055 default).
const VALID_NUM_TILES = ['2', '3', '4', '6', '9'];
const VALID_ASPECT_RATIOS = ['1x1', '9x16'];
const isValidRenderQuery = (query: Request['query']): boolean =>
  /^\d+$/.test(String(query.assetID)) &&
  VALID_NUM_TILES.includes(String(query.numTiles)) &&
  /^img\d{3}\.jpg$/.test(String(query.currentScrubberFrame)) &&
  (query.aspectRatio === undefined || VALID_ASPECT_RATIOS.includes(String(query.aspectRatio)));

export class MosaicRoutes {
  private mosaicController: MosaicController = new MosaicController();

  public route(app: Application) {
    app.post('/uploadvideo',
      (req, res, next) => this.mosaicController.uploadVideo(req, res, next),
      (req, res, next) => this.mosaicController.createManifest(req, res, next),
      (req, res, next) => this.mosaicController.probeVideo(req, res, next),
      (req, res, next) => this.mosaicController.cropVideo(req, res, next),
      (req, res, next) => this.mosaicController.resizeVideo(req, res, next),
      (req, res, next) => this.mosaicController.exportFrames(req, res, next),
      (req, res, next) => res.status(200).json({assetID: res.locals.assetID})
     );

    app.get('/render/mosaic',
      (req, res, next) => {
        if (!isValidRenderQuery(req.query)) {
          return res.status(400).send({ error: true, message: 'Invalid render parameters' });
        }
        res.locals = { ...res.locals, ...req.query }
        this.mosaicController.probeVideo(req, res, next)
      },
      (req, res, next) => this.mosaicController.renderMosaic(req, res, next),
      (req, res, next) => this.mosaicController.recordRender(req, res, next),
      (req, res, next) => res.download(`${env.getVolumnPath()}/${req.query.assetID}/${res.locals.outputFilename}`)
    );
     
    app.all('*', 
      function (req: Request, res: Response) {
        res.status(404).send({ error: true, message: 'Check your URL please' });
    });
  }
}
