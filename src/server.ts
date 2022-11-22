import { Application } from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { HTTP_PORT } from "./utils/EnvironmentVariable";
import { RouteManager } from './routers/RouteManager';

import express from 'express';
import os from "os";
import cors from 'cors';
const session = require('express-session');

var app : Application = express();

app.set('view engine','ejs'); 
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.static('public'));

app.use(
  session({
    secret: 'SomeSuperLongHardToGuessSecretString',
    resave: true,
    saveUninitialized: true,
	cookie: {
		maxAge: 10*60*1000, //10s expired
	},
  })
);

RouteManager.route(app,__dirname);

var server : Server = app.listen(HTTP_PORT, function () {
	let addr = server.address() as AddressInfo;
	let host = addr.address;
	let port = addr.port;
   	console.log("working directory : "+__dirname);
	console.log("temp directory : "+os.tmpdir());
	console.log("Server running at http://%s:%s", host, port);
});
