const express = require('express');
import * as bodyParser from "body-parser";
import { MosaicRoutes } from "./MosaicRoutes";
import { AdminRoutes } from "./AdminRoutes";
const expressFileUpload = require('express-fileupload');
import { Server } from 'socket.io';
import { createServer } from 'http';
import env from './environment';
import { NextFunction, Request, Response } from 'express';

const app = express();
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressFileUpload());
// the volume also holds originals, manifests (with location) and the failure
// log, so only the files the editor loads are public
const PUBLIC_UPLOAD_FILE = /^\/[^/]+\/(resized(_9x16)?\.mov|img\d{3}(_9x16)?\.jpg)$/;
app.use('/uploads',
  (req: Request, res: Response, next: NextFunction) => {
    if (PUBLIC_UPLOAD_FILE.test(req.path)) return next();
    res.status(404).send({ error: true, message: 'Not found' });
  },
  express.static(`${env.getVolumnPath()}`)
);
// admin routes must be registered before MosaicRoutes, which ends in a
// catch-all 404 handler that would otherwise swallow every other route
const adminRoutes = new AdminRoutes();
adminRoutes.route(app);
const mosaicRoutes = new MosaicRoutes();
mosaicRoutes.route(app);

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer);

export { app, io, httpServer };