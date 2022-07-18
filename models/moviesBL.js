const subscriptionsApiDAL = require('../DALs/subscriptionsApiDAL');
const moviesApiDAL = require('../DALs/moviesApiDAL');
const membersApiDAL = require('../DALs/membersApiDAL');
const getMovies = async () => {
    let movies = await moviesApiDAL.getMovies();
    let subscriptions = await subscriptionsApiDAL.getSubscriptions();
    let members = await membersApiDAL.getMembers();
    movies = movies.data;
    subscriptions = subscriptions.data;
    members = members.data;
    subscriptions.forEach(subscription => {
        subscription.movies.forEach(subscriptionMovie => {
            let movieIndex = movies.findIndex(movie => movie._id.toString() == subscriptionMovie.movieId);
            if (movieIndex >= 0) {
                let member = members.find(member => member._id.toString() == subscription.memberId);
                if (movies[movieIndex].subscriptions) {
                    movies[movieIndex].subscriptions.push({ memberId: subscription.memberId, memberName: member.name, date: subscriptionMovie.date })
                } else {
                    let date = new Date(subscriptionMovie.date).toLocaleDateString();
                    movies[movieIndex].subscriptions = [{ memberId: subscription.memberId, memberName: member.name, date: date }];
                }
            }
        })
    });
    return movies;
}
const updateMovie = async (id, updatedMovie) => {
    return await moviesApiDAL.updateMovie(id, updatedMovie);
}
const addMovie = async (movie) => {
    return await moviesApiDAL.addMovie(movie);
}
const deleteMovie = async (id) => {
    return await moviesApiDAL.deleteMovie(id);
}
module.exports = { getMovies, updateMovie, addMovie, deleteMovie };
