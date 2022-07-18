const express = require('express');
const router = express.Router();
const usersBL = require('../models/usersBL');

router.get('/', function (req, res) {
    res.render('createAccount', { message: req.flash('message') });
})
router.post('/submit', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    usersBL.createAccount(username, password)
        .then(() => {
            req.flash('message', 'Account created succesfully');
            res.redirect('/');
        })
        .catch(() => {
            req.flash('message', 'There has been an error, contact the admin');
            res.redirect('/createAccount');
        });
})
module.exports = router;
