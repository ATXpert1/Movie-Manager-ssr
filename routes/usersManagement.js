var express = require('express');
var router = express.Router();
const usersBL = require('../models/usersBL');

router.get('/', function (req, res) {
    usersBL.getUsersData().then(usersData => {
        res.locals.users = usersData;
        res.render('usersManagement', { usersData: usersData, message: req.flash('message') });
    }).catch(e => {
        console.log(e)
        res.redirect('/logout')
    })

})
router.post('/addUser', function (req, res) {
    let permissions = req.body.permissions;
    // format checkbox array
    if (!Array.isArray(permissions)) {
        req.body.permissions = [permissions];
    }
    usersBL.addNewUser(req.body)
        .then(x => {
            req.flash('message', 'User created!');
            res.redirect('/usersManagement');
        })
        .catch(err => {
            req.flash('message', 'There has been an error, make sure username is unique');
            res.redirect('/usersManagement');
        })
})
module.exports = router;
