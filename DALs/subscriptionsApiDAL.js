const axios = require('axios');

const getSubscriptions = () => {
    return axios.get('http://localhost:8000/api/subscriptions');
}
const addMovieToSubscription = (memberId, movieInfo) => {
    return axios.post('http://localhost:8000/api/subscriptions/' + memberId, movieInfo);
}
module.exports = { getSubscriptions, addMovieToSubscription };
