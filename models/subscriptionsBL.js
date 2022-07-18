const subscriptionsApiDAL = require('../DALs/subscriptionsApiDAL');
const getSubscriptions = async () => {
    let resp = await subscriptionsApiDAL.getSubscriptions();
    return resp.data;
}
const addMovieToSubscription = async (memberId, subscriptionInfo) => {
    let resp = await subscriptionsApiDAL.addMovieToSubscription(memberId, subscriptionInfo);
    return resp.data;
}

module.exports = { getSubscriptions, addMovieToSubscription };
