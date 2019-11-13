const express = require('express');
const router = express.Router();
const request = require('request');
const _ = require('underscore');


const API_URI = 'https://ratings.food.gov.uk/';


var searchType = 'enhanced-search'; // search, search-address, enhanced-search
var nameStr = 'cafe';
var addressStr = 'strutton ground';
var addressStr = 'wilton road, london, sw1v';
var postcode = 'SW1H';
var format = 'json';
var sortOrder = 'Alpha';
var lat = -0.135; // 3dp = aprox 350 ft
var long = 51.499;



router.get('/', function(req, res, next) {
  res.render('index', {  });
});


router.get('/error', function(req, res, next) {
  res.render('error', { content : {error: {message: "Internal server error"}}});
});



router.get('/results', function(req, res, next) {
  //var uri = API_URI+'/'+nameStr+'/'+addressStr+'/'+format+'/';

  //https://ratings.food.gov.uk/enhanced-search/en-GB/^/^/DISTANCE/0/^/-4.73561176951173/55.9421692082746/1/30/xml
  //https://ratings.food.gov.uk/enhanced-search/en-GB/^/^/DISTANCE/0/^-4.735/55.942/1/50/json/

  //var uri = API_URI+'/'+searchType+'/'+addressStr+'/1/50/'+format+'/';
	var uri = API_URI+searchType+'/en-GB/^/^/DISTANCE/0/^/'+lat+'/'+long+'/1/90/'+format+'/';

	console.log(uri);
    request(uri, {
      method: "GET",
      headers: {
          'x-api-version': '2',
          'Accept': 'application/json'
        }
      }, function (error, response, body) {

          if (!error && response.statusCode == 200) {
            if(body) {
              dataset = JSON.parse(body);
              var locations = dataset.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;
              console.log(locations[0]);

              res.render('results', {
                name: nameStr,
                address: addressStr,
                location: locations
              });

            } else {
              res.render('results', {
                name: nameStr,
                address: addressStr,
                location: []
              });
            }
          } else {
            res.redirect('/error');
          }
      });


});


module.exports = router
