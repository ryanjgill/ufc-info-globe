'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.createReadStream('./allVisits.json')
        .pipe(res);
});

module.exports = router;
