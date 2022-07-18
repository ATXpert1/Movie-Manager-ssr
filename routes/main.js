var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    req.session.save();
    res.render('main');
})

module.exports = router;
