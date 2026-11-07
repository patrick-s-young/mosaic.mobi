const express = require('express');
import * as bodyParser from "body-parser";
import { MosaicRoutes } from "./MosaicRoutes";
import { AdminRoutes } from "./AdminRoutes";
const expressFileUpload = require('express-fileupload');
import { Server } from 'socket.io';
import { createServer } from 'http';
import env from './environment';
import { NextFunction, Request, Response } from 'express';
import failureLog from './MosaicServices/FailureLogService/FailureLogService';

const app = express();
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressFileUpload());
// the volume also holds originals, manifests (with location) and the failure
// log, so only the files the editor loads are public
const PUBLIC_UPLOAD_FILE = /^\/[^/]+\/(resized(_9x16)?\.mov|img\d{3}(_9x16)?\.jpg)$/;
// an upload's ID is unique and its files never change, so they can be kept. The
// demo asset keeps the same URLs across deploys, so it has to be able to refresh.
const setUploadCacheHeaders = (res: Response, filePath: string) => {
  res.setHeader('Cache-Control', filePath.includes('/330055/')
    ? 'public, max-age=86400'
    : 'private, max-age=31536000, immutable');
};
app.use('/uploads',
  (req: Request, res: Response, next: NextFunction) => {
    if (PUBLIC_UPLOAD_FILE.test(req.path)) return next();
    res.status(404).send({ error: true, message: 'Not found' });
  },
  express.static(`${env.getVolumnPath()}`, { setHeaders: setUploadCacheHeaders })
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

// each browser joins a room named after its session, so ffmpeg progress reaches
// only the visitor whose job it is
io.on('connection', (socket) => {
  const sessionId = failureLog.cleanSessionId(socket.handshake.auth?.sessionId);
  if (sessionId !== 'unknown') socket.join(sessionId);
});

export { app, io, httpServer };