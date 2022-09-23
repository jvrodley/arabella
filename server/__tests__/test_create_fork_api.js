
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

describe("FORK PROJECT", () => {
    console.log("fork_project")
    it('dispatch_event', async function () {
        console.log("process.env.NODE_ENV = " + process.env.NODE_ENV)
        await test_dispatchevent()
    });

    async function test_createfork() {
        let keybuffer
        try {
            keybuffer = fs.readFileSync(private_key_file_name, 'utf8');
        } catch(e) {
            console.log('Error:', e.stack);
        }

        let private_key = keybuffer.toString()
        console.log("Instantiating app")
        const app = new App({appId: appId, privateKey: private_key});
        // https://docs.github.com/en/rest/repos/forks
    }


})