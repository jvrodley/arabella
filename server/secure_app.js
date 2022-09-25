import 'dotenv/config';
import express from 'express';
import moment from 'moment';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import {
  NEED_COMMAND,
  CHALLENGE_COMMAND,
  HasGuildCommands,
} from './commands.js';

import path from 'path'
import fs from 'fs';
import http from 'http';
import https from 'https';
import {discord_interaction, sendMessageToChannel} from "./discord_stuff.js";
import {getAllNeeds, getAllClaims, addNeed, forkGithubRepo, updateClaim, claimProject} from "./api.js";

const privateKey  = fs.readFileSync('sslcert/_.rodley.com.key', 'utf8');
const certificate = fs.readFileSync('sslcert/_.rodley.com.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

import ReposService from './reposService.js'
import reposService from "./reposService.js";

// Create an express app
const app = express();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

const all_routes = import('./allroutes.js').router;

console.log("starting router")
const router = express.Router();

app.use(express.static('/home/admin/arabella/server/client/build'));
// app.use(express.static('C:/Users/john/Documents/go/src/arabella/server/client/build'));

app.get('/healthcheck',  async function (req, res) {
  let datetime = moment(new Date().getMilliseconds()).format("LLLL")
  return res.status(200).send("Healthcheck okay at " + datetime);
});

app.get('/needs/:userid',  async function (req, res) {
  let needs = await getAllNeeds(req.params.userid)
  return res.status(200).json(needs);
});

app.get('/claims/:userid',  async function (req, res) {
  let needs = await getAllClaims(req.params.userid)
  return res.status(200).json(needs);
});

app.use(express.json())

app.post('/need',  async function (req, res) {
  let need = req.body
  let needs = await addNeed(need)
  return res.status(200).json(needs);
});

app.post('/fork',  async function (req, res) {
  console.log("req.body = " + JSON.stringify(req.body));
  console.log("req.params = " + JSON.stringify(req.params));
  let claim = await claimProject( req.body.needid, 1 )
  let forked_repo = await forkGithubRepo(req.body.owner, req.body.project, claim.claimid)
  let updated_claim = await updateClaim(claim.claimid, forked_repo.data.owner.login, forked_repo.data.html_url)
  console.log("forked_repo.data.html_url = " + forked_repo.data.html_url)
  return res.status(200).json(claim);
});

let hooksRecieved = [];


// CREATE PR and MERGE PR both post hooks!!

app.post("/hooks", async (req, res) => {
  let type = req.get("x-github-event" )
  if( type !== 'push' ) {
    res.sendStatus(200);
    return
  }
  if( req.body.ref === "refs/heads/main" ) {
    console.log("PUSH TO MAIN!!!!!!!")
  } else if( req.body.ref === "refs/heads/develop" ) {
    console.log("PUSH TO DEVELOP!!!!!!!")
    let createpr = await new ReposService().createPullRequest("jvrodley", "arabella", "develop", "main")
    console.log("createpr = " + JSON.stringify(createpr))
  }

  console.log("hooks post type " + type )
  console.log(JSON.stringify(req.body))
  const hookData = { recievedAt: Date(), headers: req.headers, body: req.body };
  res.sendStatus(200);
  hooksRecieved.push(hookData);
});

app.get("/hooks", (req, resp) => {
  console.log("hooks get *****************************************************************************")
  resp.send(JSON.stringify(hooksRecieved));
});

try {
  // list the webhooks
  const webhook_list = await new ReposService().listWebhooks()
  console.log("webhook_list = " + JSON.stringify(webhook_list))
  // delete the webhooks
  if( webhook_list.data.length > 0 ) {
    const delret = await new ReposService().deleteWebhook(webhook_list.data[0].id)
    console.log("delret = " + JSON.stringify(delret))
  }

  // recreate the webhooks
  const addHook = await new ReposService().createWebhook("https://arabella.rodley.com:3000/hooks",
      ["star", "push", "pull_request", "merge_group"]);
  console.log("createWebhook returns " + JSON.stringify(addHook))
} catch(e) {
  console.log(e)

}

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  return( discord_interaction(req,res))
});

await sendMessageToChannel("needs", "BLAHBLAH")

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
 
