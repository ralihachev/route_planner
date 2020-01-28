const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
var toLatLong = require('./api//functions/toLatLong');
var planRoute = require ('./api/functions/planRoute');


app.use(express.static(__dirname + '/dist/AngRoutePlanner'));

app.all('*', function (req, res)  {
    res.status(200).sendFile(__dirname + '/dist/AngRoutePlanner/index.html');
});

app.get('/api/getData', function(req, res){
    res.json({'message': 'Hello World'});
});

app.post('/api/getRoute', bodyParser.json(), function(req, res) {

    var cityFrom = toLatLong(req.body.origin);
    var cityTo = toLatLong(req.body.destination);

    var startTime = req.body.startTime+":00";
    var startDate = req.body.startDate;

    var modes = ['CAR', 'RAIL'];
    var routes = [];
    cityFrom.then(function(cityFrom){
        cityTo.then(function(cityTo){
            modes.forEach(function(mode){
                routes.push(planRoute(cityFrom, cityTo, startDate, startTime, mode))
            });
            Promise.all(routes).then(function(body){
                res.json(body);
            }).catch(function(err){
                console.log(err)
            })
        }).catch(function(err){
            console.log(err)
        })
    }).catch(function(err){
        console.log(err)
    });

});


app.listen(process.env.PORT || 8080);