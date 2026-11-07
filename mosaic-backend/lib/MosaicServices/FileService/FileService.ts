import env from '../../environment';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import failureLog from '../FailureLogService/FailureLogService';
const fs = require('fs');

export default class FileService {

    public uploadVideo (req: Request, res: Response, next: any) {
        const myFile = req['files']?.myFile;
        if (!myFile || Array.isArray(myFile)) {
          return failureLog.respond(req, res, { stage: 'upload', reason: 'no_file', status: 400 });
        }

        // random, not a timestamp: this ID is the only thing protecting a user's
        // processed files, so it must not be guessable
        const assetID = randomUUID();
        res.locals.assetID = assetID;
        const uploadVideoDirectory = `${env.getVolumnPath()}/${assetID}`;
        const path = `${uploadVideoDirectory}/upload.mov`;

        try {
          fs.mkdirSync(uploadVideoDirectory);
          console.log('Directory created successfully!');
          myFile.mv(path, (err) => {
            if (err) {
              console.log(`uploadVideo : myFile.mv err: ${err}`)
              return failureLog.respond(req, res, { stage: 'upload', reason: 'server_error', status: 500, detail: String(err) });
            }

            next();
          });

        } catch (err) {
            console.error(err);
            return failureLog.respond(req, res, { stage: 'upload', reason: 'server_error', status: 500, detail: String(err) });
        }

    }
}
