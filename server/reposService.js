import githubClient from "./githubClient.js";

class ReposService {
     async createWebhook(repositoryOwner,repositoryName, hookUrl, events, contentType = "json") {
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

    async listWebhooks(repositoryOwner,repositoryName) {
        return await new githubClient().instance.repos.listWebhooks({
            owner: repositoryOwner,
            repo: repositoryName
        });
    }

     async deleteWebhook(hookId,repositoryOwner,repositoryName) {
        return await new githubClient().instance.repos.deleteWebhook({
            owner: repositoryOwner,
            repo: repositoryName,
            hook_id: hookId,
        });
    }


    async createPullRequest(owner, repo, head, base) {
        head="develop"
        base = "main"

        let response = await new githubClient().instance.request('POST /repos/'+owner+'/'+repo+'/pulls', {
            owner: owner,
            repo: repo,
            title: 'Automated PR',
            body: 'Automated PR to main from develop for further review',
            head: head,
            base: base
        });
        console.log("pulls = " + JSON.stringify(response))

        return (response)
    }
}
export default ReposService;