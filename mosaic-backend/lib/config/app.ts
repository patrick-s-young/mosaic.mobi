
import express from 'express';
import * as bodyParser from "body-parser";
import { FileRoutes } from "../routes/file_routes";
import { RenderRoutes } from "../routes/render_routes";
import { CommonRoutes } from "../routes/common_routes";
import cors from 'cors';
const expressFileUpload = require('express-fileupload');
import env from '../environment';

class App {

   public app: express.Application;

   private fileRoutes: FileRoutes = new FileRoutes();
   private renderRoutes: RenderRoutes = new RenderRoutes();
   private commonRoutes: CommonRoutes = new CommonRoutes();

   constructor() {
      this.app = express();
      this.config();
      this.fileRoutes.route(this.app);
      this.renderRoutes.route(this.app);
      this.commonRoutes.route(this.app);

   }

   private config(): void {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(expressFileUpload());
      this.app.use('/uploads', express.static(`${env.getVolumnPath()}`));
   }
}
export default new App().app;