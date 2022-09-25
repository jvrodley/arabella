import githubClient from "./githubClient.js";
const repositoryName = "arabella";
const repositoryOwner =  "jvrodley";

class ReposService {
     async createWebhook(hookUrl, events, contentType = "json") {
        return await new githubClient().instance.repos.createWebhook({
            owner: repositoryOwner,
            repo: repositoryName,
            config: {
                url: hookUrl,
                content_type: contentType,
            },
            events: events,
        });
    }

    async listWebhooks() {
        return await new githubClient().instance.repos.listWebhooks({
            owner: repositoryOwner,
            repo: repositoryName
        });
    }

     async deleteWebhook(hookId) {
        return await new githubClient().instance.repos.deleteWebhook({
            owner: repositoryOwner,
            repo: repositoryName,
            hook_id: hookId,
        });
    }

    async createPullRequest(owner, repo, head, base) {
        head="develop"
        base = "main"

        let response = await octokit.request('POST /repos/carlosschults/ubiquitous-octo-couscous/pulls', {
            owner: owner,
            repo: repo,
            title: 'Automated PR',
            body: 'Automated PR to main from develop for further review',
            head: head,
            base: base
        });

        return await new githubClient().instance.pulls.create()
    }
}
export default ReposService;