import env from '../../environment';
import { Request, Response } from 'express';
const fs = require('fs');

export default class FileService {

    public uploadVideo (req: Request, res: Response, next: any) {
      console.log(`/n FileService.uploadVideo /n`)
        const assetID = Date.now();
        const myFile = req['files'].myFile;
        res.locals.assetID = assetID;
        const uploadVideoDirectory = `${env.getVolumnPath()}/${assetID}`; 
        const path = `${uploadVideoDirectory}/upload.mov`;

        try {
          fs.mkdirSync(uploadVideoDirectory);
          console.log('Directory created successfully!');
          myFile.mv(path, (err) => {
            if (err) {
              console.log(`uploadVideo : myFile.mv err: ${err}`)
              return res.status(500).send(err);
            }
        
            next();
          });

        } catch (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        
    }
}
