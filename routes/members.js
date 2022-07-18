const express = require('express');
const router = express.Router();
const membersBL = require('../models/membersBL');

router.post('/addMember', function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Create Subscriptions')
    if (hasPermission) {
        membersBL.addMember(req.body).then(resp => console.log(resp)).catch(err => console.log(err));
    }
    else {
        res.redirect('/main');
    }
})
router.get('/editMember/:id', async function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Update Subscriptions')
    if (hasPermission) {
        let members = await membersBL.getMembers();
        let targetMember = members.find(member => member._id == req.params.id);
        res.render('editMember', { member: targetMember });
    }
    else {
        res.redirect('/main');
    }

})
router.post('/editMember/submit/:id', function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Update Subscriptions')
    if (hasPermission) {
        let id = req.params.id;
        let member = req.body;
        membersBL.updateMember(id, member)
            .then(resp => console.log(resp))
            .catch(err => console.log(err));
    }
    else {
        res.redirect('/main');
    }

})
router.get('/deleteMember/:id', function (req, res) {
    let hasPermission = req.session.permissions.find(permission => permission == 'Delete Subscriptions')
    if (hasPermission) {
        let id = req.params.id;
        membersBL.deleteMemeber(id)
            .then(resp => {
                req.flash('message', 'Member deleted successfully');
                res.redirect('/subscriptions');
            })
            .catch(err => {
                req.flash('message', 'An error occured, contact the admin');
                res.redirect('/subscriptions');
            });
    }
    else {
        res.redirect('/main');
    }

})
module.exports = router;
