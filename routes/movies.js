const express = require('express');
const router = express.Router();
const moviesBL = require('../models/moviesBL');
router.get('/', async function (req, res) {
    let movies = await moviesBL.getMovies();
    res.render('movies', { movies: movies, message: req.flash('message') })
})
router.post('/searchMovie', async function (req, res) {
    let searchValue = req.body.searchValue;
    searchValue = searchValue.toLowerCase();
    let movies = await moviesBL.getMovies();
    let matchedResults = movies.filter((movie) => {
        let movieName = movie.name.toLowerCase();
        return movieName.includes(searchValue);
    })
    res.render('movies', { movies: matchedResults, message: req.flash('message') })
})
router.get('/:id', async function (req, res) {
    let movies = await moviesBL.getMovies();
    let targetMovie = movies.find(movie => movie._id == req.params.id);
    res.render('movies', { movies: [targetMovie], message: req.flash('message') })
})
router.get('/editMovie/:id', async function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Update Movies')
    if (hasPermission) {
        let movieId = req.params.id;
        let movies = await moviesBL.getMovies();
        let movie = movies.find(movie => movie._id == movieId);
        res.render('editMovie', { movie: movie })
    }
    else {
        res.redirect('/main');
    }
})
router.post('/editMovie/:id', function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Update Movies')
    if (hasPermission) {
        let id = req.params.id;
        let movie = req.body;
        movie.genres = movie.genres.split(',');
        moviesBL.updateMovie(id, movie)
            .then(x => res.redirect('/movies/editMovie/' + id))
            .catch(e => console.log(e));
    }
    else {
        res.redirect('/main');
    }
})
router.post('/addMovie', function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Create Movies')
    if (hasPermission) {
        let movie = req.body;
        movie.genres = movie.genres.split(',');
        moviesBL.addMovie(movie).then(x => {
            req.flash('message', 'Added movie!')
            res.redirect('/movies')
        }).catch(err => console.log(err));
    }
    else {
        res.redirect('/main');
    }

})
router.get('/delete/:id', function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Delete Movies')
    if (hasPermission) {
        let id = req.params.id;
        moviesBL.deleteMovie(id).then(resp => {
            res.redirect('/movies')
        }).catch(err => console.log(err))
    }
    else {
        res.redirect('/main');
    }

})
module.exports = router;
