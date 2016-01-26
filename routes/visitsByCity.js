'use strict';

var fs = require('fs');
var request = require('request');
var async = require('async');
var express = require('express');
var router = express.Router();
var Converter = require('csvtojson').Converter;
var converter = new Converter({
  constructResult: true
});
var visitsConverter = new Converter({
    constructResult: true
});

var _data = [];

var visits = [];

var stream, stream2;

/* GET all the visits by city */
router.get('/', function(req, res, next) {

    if (_data && _data.length) {
		console.log('already got it');
		return res.json(_data[1]);
	}

   stream = fs.createReadStream('./visits_city_country.csv')
		.pipe(converter);

    converter.on('end_parsed', function (data) {
        console.log('done parsing visits');
        //stream.end();
        //data.shift(); // remove the invalid result
        var topTen = [];
        for(var x = 0; x<2; x++) {
            topTen.push(data[x+1]);
        }
        async.mapSeries(mostPopular, getGeo, function (err, result) {
            if (err) { return console.log(err); }
            console.log(result);

            fs.writeFile('./topFortyCities.json', JSON.stringify(result, null, 2), function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("JSON saved to ./topFortyCities.json");
                res.json(result);
            });
        });
    });

    function getGeo(visit, cb) {
        //return cb(null, visit);
        let city = visit.City.split(' ').join('_');
        // get a key cause your are blowing up the limit
        setTimeout(function () {
            request(`http://maps.googleapis.com/maps/api/geocode/json?address=${city}&sensor=false`, function (err, res, body) {
                if (err) { return cb(err); }
                let match = JSON.parse(body).results[0];
                if (!match) {
                    console.log('no match for: ' + visit.City);
                    console.log(JSON.parse(body));
                    return cb(null, visit);
                }
                //let address = match.formatted_address;
                let lat = match.geometry.location.lat;
                let lng = match.geometry.location.lng;
                //mappedCities.push({ city, lat, lng });
                visit.lat = lat;
                visit.lng = lng;
                cb(null, visit);
            });
        }, 110);
    }


});

module.exports = router;

