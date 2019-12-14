const request = require('request');
const polyline = require('polyline');


module.exports = function planRoute(cityFrom, cityTo, startDate, startTime, mode) {

    var date = new Date();

    if (startDate.length == 0 || !startDate){
        startDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }

    if (startTime.length == 3 || !startTime){
        startTime = date.getHours()+':'+date.getMinutes()+':00'
    }

    return new Promise (function(resolve, reject){

        var req = {
            url: 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
            method: 'POST',
            headers: { "Content-Type": "application/graphql" },
            body: `{
                plan(
                    from: {lat: `+cityFrom[1]+`, lon: `+cityFrom[0]+`}
                    to: {lat: `+cityTo[1]+`, lon: `+cityTo[0]+`}
                    date: `+'"'+startDate+'"'+`
                    time: `+'"'+startTime+'"'+`
                    transportModes: [{mode: `+mode+`}, {mode:WALK}]
                    numItineraries: 5
                    minTransferTime: 600
                    walkSpeed: 1.7

                )

            {
                itineraries {
                    legs {
                        mode
                        duration
                        distance
                        startTime
                        endTime
                        from {
                            name
                            stop {
                                code
                                name
                            }
                        }
                        to {
                            name
                            stop {
                                code
                                name
                            }
                        }
                        trip {
                            route {
                                shortName
                            }
                        }

                        legGeometry {
                            length
                            points
                        }
                    }
                }
            }
        }`
    };

    request(req, function (error, response, body) {
        if (error) reject (error);

        if (!error && response.statusCode == 200) {

            var plan = JSON.parse(body).data.plan;

            var itinerary = plan.itineraries;

        }

        resolve(itinerary)
    });


    });

}
