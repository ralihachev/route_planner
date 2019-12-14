import { Component, AfterViewInit, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ApicallService} from '../services/apicall.service'


declare var L: any;
declare var polyline: any;

@Component({
    selector: 'app-route',
    templateUrl: './route.component.html',
    styleUrls: ['./route.component.css'],
})
export class RouteComponent implements OnInit, AfterViewInit {
    itinerary: string;
    origin: string;
    destination: string;
    result: any=[];
    routes: any=[];
    modes: any=[];
    modes_duration: any=[];
    routeForm;

    private map;

    constructor(private route: ActivatedRoute,  private formBuilder: FormBuilder, private router: Router, private apicallservice: ApicallService) {
        this.routeForm = this.formBuilder.group({
            origin: '',
            destination: '',
            startDate: '',
            startTime: '',
            mode: ''
        })
    }


    ngOnInit(): void{
        this.route.queryParams.subscribe(params => {
            this.itinerary = params.itinerary;
            this.origin = params.origin;
            this.destination = params.destination;
            this.result = JSON.parse(this.itinerary);

            for (let itinerary of this.result[1]){
                for (let leg of itinerary.legs){
                    this.modes.push(leg.mode);
                    this.modes_duration.push(Math.ceil(leg.duration/60));
                }
                this.routes.push({
                    timeStart: new Date (itinerary.legs[0].startTime),
                    timeEnd: new Date (itinerary.legs[itinerary.legs.length - 1].endTime),
                    modes: [{mode: this.modes, duration: this.modes_duration}]
                });

                this.modes = [];
                this.modes_duration = []
            }
        });
    }

    ngAfterViewInit(): void{
        this.initMap();
    }


    private initMap(): void {

        this.map = L.map('map', {
            center: [ 63.8415, 23.1250]
        });

        const tiles = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            id: 'hsl-map'});
        tiles.addTo(this.map);

        var itinerary_features = L.layerGroup().addTo(this.map);

        var leg_polyline = L.polyline([],
            {
                color: '#'+Math.random().toString(16).substr(-6),
                weight: 7
            }).addTo(itinerary_features);

        for (var i = 0; i<this.result[0].legs.length; i++){

            var points = polyline.decode(this.result[0].legs[i].legGeometry.points);

            for (var j=0; j < points.length; j++) {
                leg_polyline.addLatLng(L.latLng(points[j][0], points[j][1]));
            }

            var markerLeg = L.marker([points[0][0], points[0][1]], {title: ''}).addTo(this.map);
            this.map.fitBounds(leg_polyline.getBounds());
        }
    }

    onSubmit(routeData){
        console.log(routeData);
        this.apicallservice.postAPIData(routeData).subscribe((response)=>{
            response = JSON.stringify(response);
            this.router.navigate(['/route'], {queryParams: {origin: routeData.origin, destination: routeData.destination, itinerary: response}});
        }, (error)=>{
            this.router.navigate(['/route'], {queryParams: {route: error}});
            console.log(error);
        });

    }

}
