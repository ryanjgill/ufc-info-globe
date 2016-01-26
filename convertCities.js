'use strict';

var fs = require('fs');
var request = require('request');
var async = require('async');
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


if (_data && _data.length) {
    console.log('already got it');
}

stream = fs.createReadStream('./visits_city_country.csv')
    .pipe(converter);

converter.on('end_parsed', function (data) {
    console.log('done parsing visits');
    //stream.end();
    //data.shift(); // remove the invalid result
    //var topTen = [];
    //for(var x = 0; x<10; x++) {
    //    topTen.push(data[x+1]);
    //}
    async.mapSeries(data, getGeo, function (err, result) {
        if (err) { return console.log(err); }
        console.log(result[0]);
        fs.writeFile('./visits.json', JSON.stringify(result, null, 2), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("JSON saved to ./visits.json");
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
