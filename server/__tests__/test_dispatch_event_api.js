
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

describe("DISPATCH EVENT", () => {
    console.log("dispatch_event")
    it('dispatch_event', async function () {
        console.log("process.env.NODE_ENV = " + process.env.NODE_ENV)
        await test_dispatchevent()
    });

    function authenticate() {
        client = new GitHubClient(new ProductHeaderValue(app_name));
        tokenAuth = new Credentials(my_token); // NOTE: not real token
        client.Credentials = tokenAuth;
    }

    async function test_dispatchevent() {
        let keybuffer
        try {
            keybuffer = fs.readFileSync(private_key_file_name, 'utf8');
        } catch(e) {
            console.log('Error:', e.stack);
        }

        let private_key = keybuffer.toString()
        console.log("Instantiating app")
        const app = new App({appId: appId, privateKey: private_key});

        for await (const {octokit, repository} of app.eachRepository.iterator()) {
            console.log("eventing repo named " + repository.name )
            // https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event
            await octokit.rest.repos.createDispatchEvent({
                owner: repository.owner.login,
                repo: repository.name,
                event_type: "test_event",
                client_payload: {
                    foo: "bar",
                },
            });
            octokit.rest.repos.createFork
            console.log("Event dispatched for repo named " + repository.full_name);
        }
    }


})