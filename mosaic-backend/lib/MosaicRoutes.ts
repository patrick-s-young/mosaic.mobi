import { Application, Request, Response } from 'express';
import { MosaicController } from './MosaicController';
import env from './environment';


export class MosaicRoutes {
  private mosaicController: MosaicController = new MosaicController();

  public route(app: Application) {
    app.post('/uploadvideo',  
      (req, res, next) => this.mosaicController.uploadVideo(req, res, next), 
      (req, res, next) => this.mosaicController.probeVideo(req, res, next),
      (req, res, next) => this.mosaicController.cropVideo(req, res, next),
      (req, res, next) => this.mosaicController.resizeVideo(req, res, next),
      (req, res, next) => this.mosaicController.exportFrames(req, res, next),
      (req, res, next) => res.status(200).json({assetID: res.locals.assetID})
     );

    app.get('/render/mosaic',  
      (req, res, next) => {
        res.locals = { ...res.locals, ...req.query }
        console.log('render/mosaic res.locals: ', res.locals)
        this.mosaicController.probeVideo(req, res, next)
      },
      (req, res, next) => this.mosaicController.renderMosaic(req, res, next), 
      (req, res, next) => res.download(`${env.getVolumnPath()}/${req.query.assetID}/mosaic.mov`)
    );
     
    app.all('*', 
      function (req: Request, res: Response) {
        res.status(404).send({ error: true, message: 'Check your URL please' });
    });
  }
}
