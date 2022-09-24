import 'dotenv/config';
import express from 'express';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import {
  NEED_COMMAND,
  CHALLENGE_COMMAND,
  HasGuildCommands,
} from './commands.js';

import fs from 'fs';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import {discord_interaction} from "./discord_stuff.js";


const privateKey  = fs.readFileSync('sslcert/_.rodley.com.key', 'utf8');
const certificate = fs.readFileSync('sslcert/_.rodley.com.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

// Create an express app
const app = express();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

// global.__root   = __dirname + '/';

const all_routes = import('./allroutes.js').router;

console.log("starting router")
const router = express.Router();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
//    res.render('error');
});

// Test the database connection
// bubbles_db.testConnection( function(err) { log.error("!!!!!!!!!!!!!!!!!! ", err); process.exit(1)})

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  return( discord_interaction(req,res))
});

app.get('/healthcheck',  async function (req, res) {
  return res.status(200).send("Hey it worked!");
});

// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// httpServer.listen(3000);
httpsServer.listen(PORT, "0.0.0.0",() => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    NEED_COMMAND,
    CHALLENGE_COMMAND,
  ]);
});
 
