import env from '../../environment';
import { Request, Response } from 'express';
const fs = require('fs');

export default class FileService {

    public async uploadVideo (req: Request, res: Response, next: any) {
        const assetID = Date.now();
        const myFile = req['files'].myFile;
        res.locals.assetID = assetID;
        const uploadVideoDirectory = `${env.getVolumnPath()}/${assetID}`; 
        const path = `${uploadVideoDirectory}/upload.mov`;

        if (!fs.existsSync(uploadVideoDirectory)) {
          fs.mkdirSync(uploadVideoDirectory);
        }
        if (!fs.existsSync(uploadVideoDirectory)) {
          console.log('make directory error!');
        } else {
          console.log('Directory created successfully!');
        }

        myFile.mv(path, (err: string) => {
          if (err) {
            console.log('File uploaded error!', err);
            return res.status(500).send(err);
          } else {
            console.log('File uploaded successfully!');
            next();
          }
        });

    }
}
