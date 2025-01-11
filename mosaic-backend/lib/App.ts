
import express from 'express';
import * as bodyParser from "body-parser";
import { MosaicRoutes } from "./MosaicRoutes";
const expressFileUpload = require('express-fileupload');
import env from './Environment';

class App {
   public app: express.Application;
   private mosaicRoutes: MosaicRoutes = new MosaicRoutes();

   constructor() {
      this.app = express();
      this.config();
      this.mosaicRoutes.route(this.app);
   }

   private config(): void {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(expressFileUpload());
      this.app.use('/uploads', express.static(`${env.getVolumnPath()}`));
   }
}
export default new App().app;