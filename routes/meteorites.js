var fs = require('fs');
var express = require('express');
var router = express.Router();
var Converter = require('csvtojson').Converter;
var converter = new Converter({
  constructResult: true
});

var _data = [];

/* GET all the meteorites */
router.get('/', function(req, res, next) {
	if (_data && _data.length) {
		console.log('already got it');
		return res.json(_data);
	}

  var stream = fs.createReadStream('./Meteorite_Landings.csv')
		.pipe(converter)

	converter.on('end_parsed', function (data) {
		_data = data.reduce(function (out, m) {
			if (m['mass (g)'] < 454) { return out; }

			out.push(m);
			return out;
		}, []);

		_data = data;
		console.log('done parsing');
		res.json(_data);
	});
});

module.exports = router;
