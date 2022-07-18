const jwt = require('jsonwebtoken');
const usersModel = require('../models/usersModel');
var express = require('express');
var router = express.Router();
const usersBL = require('../models/usersBL');

router.get('/', function (req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'no one will know the secret', function (err, decodedToken) {
            if (err) {
                res.redirect('/');
            }
            else {
                res.redirect('/main')
            }
        })
    }
    else {
        res.render('login', { message: req.flash('message') });
    }
});

router.post('/login/submit', async function (req, res) {
    const RSA_PRIVATE_KEY = 'no one will know the secret';
    let username = req.body.username;
    let password = req.body.password;
    // 3 days for token to live
    let maxAge1 = 24 * 60 * 1000;
    let user = await usersModel.login(username, password);

    if (user) {
        var token = jwt.sign({ id: user._id },
            RSA_PRIVATE_KEY,
            { expiresIn: maxAge1 })
        res.cookie('jwt', token, { maxAge: maxAge1 });
        req.session.createdAt = Date.now();
        req.session.cookie.maxAge = Date.now() + maxAge1;
        req.session.userId = user._id.toString();
        let users = await usersBL.getUsersData();
        let targetUser = users.find(targetUser => targetUser.id == user._id)
        req.session.permissions = targetUser.permissions;
        req.session.save()
        res.redirect('/main');
    }
    else {
        req.flash('message', 'Credentials not recognized')
        res.redirect('/');
    }
})

module.exports = router;