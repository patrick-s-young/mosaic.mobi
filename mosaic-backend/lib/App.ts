const express = require('express');
import * as bodyParser from "body-parser";
import { MosaicRoutes } from "./MosaicRoutes";
import { AdminRoutes } from "./AdminRoutes";
const expressFileUpload = require('express-fileupload');
import { Server } from 'socket.io';
import { createServer } from 'http';
import env from './environment';

const app = express();
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressFileUpload());
app.use('/uploads', express.static(`${env.getVolumnPath()}`));
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