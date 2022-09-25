
import { Octokit } from "@octokit/rest";

class GithubClient {
    constructor() {
        this.instance = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }
}
module.exports = new GithubClient();