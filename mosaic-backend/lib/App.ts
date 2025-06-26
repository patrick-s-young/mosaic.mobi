const express = require('express');
import * as bodyParser from "body-parser";
import { MosaicRoutes } from "./MosaicRoutes";
const expressFileUpload = require('express-fileupload');
import { Server } from 'socket.io';
import { createServer } from 'http';
import env from './Environment';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressFileUpload());
app.use('/uploads', express.static(`${env.getVolumnPath()}`));
const mosaicRoutes = new MosaicRoutes();
mosaicRoutes.route(app);

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer);

export { app, io, httpServer };