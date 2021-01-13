import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import { FFmpegRoutes } from "../routes/ffmpeg_routes";
import { CommonRoutes } from "../routes/common_routes";

class App {

   public app: express.Application;

   private ffmpegRoutes: FFmpegRoutes = new FFmpegRoutes();
   private commonRoutes: CommonRoutes = new CommonRoutes();

   constructor() {
      this.app = express();
      this.config();
      this.ffmpegRoutes.route(this.app);
      this.commonRoutes.route(this.app);

   }

   private config(): void {
      const upload = multer();
      this.app.use(upload.array()); 
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
   }
}
export default new App().app;