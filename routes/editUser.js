const express = require('express');
const router = express.Router();
const usersBL = require('../models/usersBL');
router.get('/:id', function (req, res) {
    // await usersBL.getUsersData();
    usersBL.getUsersData().then(users => {
        let user = users.find(user => user.id == req.params.id);
        res.render('editUser', { user: JSON.stringify(user), message: req.flash('message') });
    }).catch(e => console.log(e));

})
router.post('/submit/:id', function (req, res) {
    usersBL.editUser(req.params.id, req.body).then(x => res.redirect('/usersManagement'))
        .catch(e => {
            req.flash('message', 'Make sure username value is unique')
            res.redirect('/editUser/' + req.params.id);
        })
})
router.get('/delete/:id', function (req, res) {
    usersBL.deleteUser(req.params.id).catch(e => console.log(e))
})
module.exports = router;
