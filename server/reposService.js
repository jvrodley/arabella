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

     async deleteWebhook(hookId) {
        return await new githubClient().instance.repos.deleteWebhook({
            owner: repositoryOwner,
            repo: repositoryName,
            hook_id: hookId,
        });
    }

}
export default ReposService;