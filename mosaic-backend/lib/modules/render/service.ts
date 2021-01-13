import { Request, Response } from 'express';
const axios = require('axios');

export default class RenderService {
    
    public resizeVideo (req: Request, res: Response, next: any) {
        axios.post('http://api:3002/resize', {
              assetID: res.locals.assetID
          })
          .then(function (response) {
            console.log(response);
            res.locals.status = 'success';
            next();
          })
          .catch(function (error) {
            console.log(error);
            res.locals.status = 'error';
            res.locals.error = error;
            next();
          });
      }
    
    public exportFrames (fileName: string, callBack: any) {

    }

    public renderMosaic (req: Request, res: Response, next: any) {
        axios.post('http://api:3002/mosaic', {
              assetID: req.query.assetID,
              numTiles: req.query.numTiles,
              currentScrubberFrame: req.query.currentScrubberFrame
          })
          .then(function (response) {
            console.log(response);
            res.locals.response = 'success';
            next();
          })
          .catch(function (error) {
            console.log(error);
            res.locals.response = 'error';
            res.locals.error = error;
            next();
          });
    }

}