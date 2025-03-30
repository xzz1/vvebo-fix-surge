let url = $request.url.replace(/(count=)\d+/, "$125");
let hasUid = (url) => url.includes("uid");
let getUid = (url) => (hasUid(url) ? url.match(/uid=(\d+)/)[1] : '5230204825'); // edit by iphone

if (url.includes("remind/unread_count")) {
    $persistentStore.write(getUid(url), "uid");
    $done({});
} else if (url.includes("statuses/user_timeline")) {
    let uid = getUid(url) || $persistentStore.read("uid");
    url = url.replace("statuses/user_timeline", "profile/statuses/tab").replace("max_id", "since_id");
    url = url + `&containerid=230413${uid}_-_WEIBO_SECOND_PROFILE_WEIBO`;
    $done({ url });
} else if (url.includes("profile/statuses/tab")) {
    let data = JSON.parse($response.body);
    let statuses = data.cards
        .map((card) => (card.card_group ? card.card_group : card))
        .flat()
        .filter((card) => card.card_type === 9)
        .map((card) => card.mblog)
        .map((status) => (status.isTop ? { ...status, label: "置顶" } : status));
    let sinceId = data.cardlistInfo.since_id;
    $done({ body: JSON.stringify({ statuses, since_id: sinceId, total_number: 100 }) });
} else {
    $done({});
}
