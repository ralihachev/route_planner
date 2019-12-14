var request = require ('request');

module.exports = function toLatLong(city) {
    return new Promise(function(resolve, reject){
        var options = {
            method: 'GET',
            url: 'http://api.digitransit.fi/geocoding/v1/search',
            qs: {
                text: city,
                size: 1
            }
        };
        request(options, function(err, res, body){
            if (err) reject (err);
            body=JSON.parse(body);
            resolve (body.features[0].geometry.coordinates);
        });
    })
};


