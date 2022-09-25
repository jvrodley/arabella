import githubClient from './githubClient.js'

class ActivityService {
    async starRepository(repositoryOwner,repositoryName ) {
        console.log("starRepository")
        return await new githubClient().instance.activity.starRepoForAuthenticatedUser({
            owner: repositoryOwner,
            repo: repositoryName,
        });
    }

    async unstarRepository(repositoryOwner,repositoryName ) {
        console.log("unstarRepository")
        return await new githubClient().instance.activity.unstarRepoForAuthenticatedUser({
            owner: repositoryOwner,
            repo: repositoryName,
        });
    }

}

export default ActivityService;