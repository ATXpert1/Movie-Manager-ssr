const membersApiDAL = require('../DALs/membersApiDAL');
const subscriptionsApiDAL = require('../DALs/subscriptionsApiDAL');
const moviesApiDAL = require('../DALs/moviesApiDAL');
const getMembers = async () => {
    let resp1 = await membersApiDAL.getMembers();
    let resp2 = await subscriptionsApiDAL.getSubscriptions();
    let resp3 = await moviesApiDAL.getMovies();
    let members = resp1.data;
    let subscriptions = resp2.data;
    let movies = resp3.data;
    members.forEach((member) => {
        let memberSubscriptions = subscriptions.find(subscription => subscription.memberId == member._id);
        if (memberSubscriptions) {
            memberSubscriptions.movies.forEach((movieWatched, index) => {
                let movieData = movies.find(movie => movie._id == movieWatched.movieId);
                if (movieData) {
                    let date = new Date(movieWatched.date).toLocaleDateString();
                    memberSubscriptions.movies[index] = { ...movieWatched, movieName: movieData.name, date: date }
                }
            })
            member.movies = memberSubscriptions.movies;
        }
    })
    return members;
}
const addMember = async (member) => {
    let resp = await membersApiDAL.addMember(member);
    return resp.data;
}
const updateMember = async (id, member) => {
    let resp = await membersApiDAL.updateMember(id, member);
    return resp.data;
}
const deleteMemeber = async (id) => {
    let resp = await membersApiDAL.deleteMember(id);
    return resp.data;
}
module.exports = { getMembers, updateMember, deleteMemeber, addMember };
