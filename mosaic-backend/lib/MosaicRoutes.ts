import { Application, NextFunction, Request, Response } from 'express';
import { MosaicController } from './MosaicController';
import failureLog from './MosaicServices/FailureLogService/FailureLogService';
import env from './environment';
const express = require('express');

// render query params flow into filesystem paths and ffmpeg args, so anything
// outside the shapes the frontend actually sends is rejected up front.
// assetIDs are random UUIDs, or numeric for older uploads and the bundled
// 330055 default.
const VALID_NUM_TILES = ['2', '3', '4', '6', '9'];
const VALID_ASPECT_RATIOS = ['1x1', '9x16'];
const ASSET_ID_PATTERN = /^(\d+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
const isValidRenderQuery = (query: Request['query']): boolean =>
  ASSET_ID_PATTERN.test(String(query.assetID)) &&
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
          return res.status(400).send({ error: true, stage: 'render', reason: 'invalid_request' });
        }
        res.locals = { ...res.locals, ...req.query }
        this.mosaicController.probeVideo(req, res, next)
      },
      (req, res, next) => this.mosaicController.renderMosaic(req, res, next),
      (req, res, next) => this.mosaicController.recordRender(req, res, next),
      (req, res, next) => res.download(`${env.getVolumnPath()}/${req.query.assetID}/${res.locals.outputFilename}`)
    );
     
    // failures only the browser can see; text() rather than json() so a bad
    // body gets a clean 400 from the service instead of a parser error
    app.post('/api/failure',
      express.text({ type: '*/*', limit: '2kb' }),
      (req: Request, res: Response) => failureLog.reportFromClient(req, res)
    );

    app.all('*', 
      function (req: Request, res: Response) {
        res.status(404).send({ error: true, message: 'Check your URL please' });
    });

    // anything thrown in a route still reaches the client as a failure it can
    // show, rather than an HTML stack trace
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);
      failureLog.respond(req, res, {
        stage: req.path.startsWith('/render') ? 'render' : 'upload',
        reason: 'server_error',
        status: err?.status ?? 500,
        detail: String(err)
      });
    });
  }
}
