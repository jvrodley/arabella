

import ReposService from "../../server/reposService";
import ActivityService from "../../server/activityService";
import WebhookListener from "./webhookListener";

const repoSvc = new ReposService();
const activitySvc = new ActivityService();
const captainHook = new WebhookListener();



export async function testWebhook() {
    const hookConfig = await captainHook.setup();
    console.log(`Listening on ${hookConfig.url}`);

    const addHook = await repoSvc.createWebhook(hookConfig.url, ["star"]);

    await activitySvc.starRepository("jvrodley", "arabella");
    await activitySvc.unstarRepository("jvrodley", "arabella");

    captainHook.hooksReceived.forEach((hook) =>
        console.log(JSON.stringify(hook))
    );

    // commented out to see the webhook registered in github in the repository settings
    const deleteResponse = await repoSvc.deleteWebhook(addHook.data.id);
    await captainHook.stop();
    console.log(`fin`);
}
