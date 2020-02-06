const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var toLatLong = require('./functions/toLatLong');
var planRoute = require ('./functions/planRoute');

var port = process.env.PORT || 8080 ;


app.get('/getData', function(req, res){
     res.json({'message': 'Hello World'});
});

app.post('/getRoute', bodyParser.json(), function(req, res) {

    var cityFrom = toLatLong(req.body.origin);
    var cityTo = toLatLong(req.body.destination);

    var startTime = req.body.startTime+":00";
    var startDate = req.body.startDate;

    /*var modes = ['CAR', 'RAIL'];
    var routes = [];*/
    cityFrom.then(function(cityFrom){
        cityTo.then(function(cityTo){
            /*modes.forEach(function(mode){
                routes.push(planRoute(cityFrom, cityTo, startDate, startTime, mode))
            });*/
            var route = planRoute(cityFrom, cityTo, startDate, startTime);
            res.json(route);
            /*Promise.all(routes).then(function(body){
                res.json(body);
            }).catch(function(err){
                console.log(err)
            })*/
        }).catch(function(err){
            console.log(err)
        })
    }).catch(function(err){
        console.log(err)
    });

});


app.listen(port, function(){
    console.log('App listening on port 3000!')
});