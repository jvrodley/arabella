import githubClient from './githubClient.js'
const repositoryName = "arabella";
const repositoryOwner =  "jvrodley";

class ActivityService {
    async starRepository() {
        return await new githubClient().instance.activity.starRepoForAuthenticatedUser({
            owner: repositoryOwner,
            repo: repositoryName,
        });
    }

    async unstarRepository() {
        return await new githubClient().instance.activity.unstarRepoForAuthenticatedUser({
            owner: repositoryOwner,
            repo: repositoryName,
        });
    }

}

export default ActivityService;