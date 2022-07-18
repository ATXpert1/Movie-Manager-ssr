const axios = require('axios');

const getMovies = () => {
    return axios.get('http://localhost:8000/api/movies');
}
const updateMovie = (id, updatedMovie) => {
    return axios.put('http://localhost:8000/api/movies/' + id, updatedMovie);
}
const addMovie = (movie) => {
    return axios.post('http://localhost:8000/api/movies', movie);
}
const deleteMovie = (id) => {
    return axios.delete('http://localhost:8000/api/movies/' + id)
}
module.exports = { getMovies, updateMovie, addMovie, deleteMovie };