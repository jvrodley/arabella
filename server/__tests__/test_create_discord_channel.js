
const expect = import('chai').expect;
const assert = import('chai').assert;

import{ App } from "octokit";
import fs from "fs";

let my_token = process.env.MY_GITHUB_TOKEN
let my_forked_project = process.env.FORKED_PROJECT
let appId = process.env.APP_ID
let private_key_file_name = process.env.PRIVATE_KEY_FILE_NAME
let app_name = process.env.APP_NAME

let tokenAuth // NOTE: not real token
let client

describe("CREATE DISCORD CHANNEL", () => {
    console.log("create_channel")
    it('create_channel', async function () {
        console.log("process.env.NODE_ENV = " + process.env.NODE_ENV)
        await test_createchannel()
    });

    async function test_createchannel() {
        register();
    }


})

function register() {
    const { REST, Routes } = require('discord.js');

    const commands = [
        {
            name: 'ping',
            description: 'Replies with Pong!',
        },
    ];

    const rest = new REST({ version: '10' }).setToken('token');

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

}

/*

// Create an invite to a channel
channel.createInvite()
  .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
  .catch(console.error);

// Create an invite to a channel
channel.createInvite()
  .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
  .catch(console.error);


// Send a basic message
channel.send('hello!')
  .then(message => console.log(`Sent message: ${message.content}`))
  .catch(console.error);


 */