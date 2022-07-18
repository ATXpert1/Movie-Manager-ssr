const jwt = require('jsonwebtoken');
const usersBL = require('../models/usersBL');
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'no one will know the secret', (err, decodedToken) => {
            if (err) {
                res.redirect('/');
            }
            else {
                res.locals.userId = decodedToken.id;
                next();
            }
        })
    }
    else {
        res.redirect('/');
    }
}
const manageUsersPermission = (req, res, next) => {
    if (res.locals.username === 'admin') {
        next();
    }
    else {
        res.redirect('/main');
    }
}
const watchSubscriptionsPermission = (req, res, next) => {
    let hasPermission = req.session.permissions.find(permission => permission == 'View Subscriptions')
    if (hasPermission) {
        next();
    }
    else {
        res.redirect('/main');
    }
}
const watchMoviesPermission = (req, res, next) => {
    let hasPermission = req.session.permissions.find(permission => permission == 'View Movies')
    if (hasPermission) {
        next();
    }
    else {
        res.redirect('/main');
    }
}
const getCurrentUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'no one will know the secret', async (err, decodedToken) => {
            if (err) {
                res.locals.username = null;
                next();
            }
            else {
                let user = await usersBL.getUserById(decodedToken.id);
                res.locals.username = user.username;
                res.locals.userId = decodedToken.id;
                next();
            }
        })
    }
    else {
        res.locals.username = null;
        next();
    }
}
const userTimeoutController = (req, res, next) => {
    if (req.session.userId == null || req.session.logout) {
        return next();
    }
    usersBL.getUsersData().then(users => {
        let user = users.find(user => user.id == req.session.userId);
        // minute = 60000
        if ((Date.now() - req.session.createdAt) > user.sessionTimeOut * 60 * 1000) {
            req.session.logout = true;
            req.session.save()
            res.redirect('/logout');
        }
        else {
            next();
        }
    }).catch(e => {
        res.redirect('/logout')
    })
}
module.exports = {
    requireAuth,
    getCurrentUser,
    userTimeoutController,
    watchMoviesPermission,
    watchSubscriptionsPermission,
    manageUsersPermission
};
