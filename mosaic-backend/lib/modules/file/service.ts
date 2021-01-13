import env from '../../environment';
import { Request, Response } from 'express';
const fs = require('fs');

export default class FileService {

    public uploadVideo (req: Request, res: Response, next: any) {
        const assetID = Date.now();

        const uploadVideoDirectory = `${env.getVolumnPath()}/${assetID}`; 
        fs.mkdir(uploadVideoDirectory, (err) => {
          console.log(`uploadVideo: fs.mkdir(${uploadVideoDirectory}) calledback with error: ${err}`)
        });
        
        const myFile = req['files'].myFile;
        res.locals.assetID = assetID;
        //res.locals.filename  = `${assetID}.mov`;
        const path = `${uploadVideoDirectory}/upload.mov`;
        console.log(`service.ts : uploadVideo : path: ${path} : `)
        myFile.mv(path, (err: string) => {
            console.log(`uploadVideo : myFile.mv err: ${err}`)
            next();
        });
    }
}
