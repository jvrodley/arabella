
import { Octokit } from "@octokit/rest";

class GithubClient {
    constructor() {
        this.instance = new Octokit({ auth: process.env.MY_GITHUB_TOKEN });
    }
}
export default GithubClient