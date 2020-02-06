const express = require('express');
const path = require('path');
var app = express();
var bodyParser = require ('body-parser');
var toLatLong = require('./api/functions/toLatLong');
var planRoute = require('./api/functions/planRoute');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/dist/AngRoutePlanner'));

app.get('/', function (req, res)  {
    res.status(200).sendFile(__dirname + '/dist/AngRoutePlanner/index.html');
});

app.post('/api/getRoute', function(req, res){
    var cityFrom = toLatLong(req.body.origin);
    var cityTo = toLatLong(req.body.destination);
    var startTime = req.body.startTime+":00";
    var startDate = req.body.startDate;
    cityFrom.then(function(cityFrom){
        cityTo.then(function(cityTo){
            var route = planRoute(cityFrom, cityTo, startDate, startTime);
            route.then(function(route){
                console.log(route);
                res.json(route);
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

var server = app.listen(port, function(){
    console.log('Listening on port ', port);
});


