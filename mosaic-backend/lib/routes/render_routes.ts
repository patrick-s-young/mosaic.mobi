import { Application, Request, Response } from 'express';
import { RenderController } from '../controllers/renderController';
import env from '../environment';

export class RenderRoutes {

  private render_controller: RenderController = new RenderController();
  
  public route(app: Application) {

      app.get('/render/mosaic',  
         (req, res, next) => this.render_controller.render_mosaic(req, res, next), 
         (req, res, next) => {
            console.log(`express-server : render_routes : res.locals.response: ${res.locals.response}`)
            const downloadRenderDirectory = `${env.getVolumnPath()}/${req.query.assetID}/mosaic.mov`;
            res.download(downloadRenderDirectory);
            
         //res.status(200).json({message:`/render/mosaic: POST request successfull. Rendered mosaic with movie: ${req.body.filename}`});
      });
   }
}