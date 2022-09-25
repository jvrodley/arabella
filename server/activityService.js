import githubClient from './githubClient.js'
const repositoryName = "arabella";
const repositoryOwner =  "jvrodley";

class ActivityService {
    async starRepository() {
        return await githubClient.instance.activity.starRepoForAuthenticatedUser({
            owner: repositoryOwner,
            repo: repositoryName,
        });
    }

    async unstarRepository() {
        return await githubClient.instance.activity.unstarRepoForAuthenticatedUser({
            owner: repositoryOwner,
            repo: repositoryName,
        });
    }

}

module.exports = ActivityService;