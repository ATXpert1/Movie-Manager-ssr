const express = require('express');
const router = express();

router.get('/', function (req, res) {
    res.clearCookie("jwt");
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;
