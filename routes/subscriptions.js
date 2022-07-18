const express = require('express');
const router = express.Router();
const membersBL = require('../models/membersBL');
const moviesBL = require('../models/moviesBL');
const subscriptionsBl = require('../models/subscriptionsBL');
router.get('/', async function (req, res) {
    let members = await membersBL.getMembers();
    let movies = await moviesBL.getMovies();
    res.render('subscriptions', { members: members, movies: movies, message: req.flash('message') })
})
router.post('/addMovieToSubscription/:id', function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Create Subscriptions')
    if (hasPermission) {
        let memberId = req.params.id;
        let subscriptionInfo = req.body;
        subscriptionsBl.addMovieToSubscription(memberId, subscriptionInfo)
            .then(resp => {
                req.flash('message', "added movie!");
                res.redirect('/subscriptions');
            })
            .catch(err => {
                req.flash('message', "there was an error adding movie")
                res.redirect('/subscriptions')
            });
    }
    else {
        res.redirect('/main');
    }
})
module.exports = router;
