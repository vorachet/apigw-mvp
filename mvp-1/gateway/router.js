var express = require('express');
var router = express.Router()
var security = require('./security')

router.use(security)

module.exports = router;
