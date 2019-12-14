import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import {ApicallService} from '../services/apicall.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

    routeForm;

    constructor (private formBuilder: FormBuilder, private router: Router, private apicallservice: ApicallService) {
        this.routeForm = this.formBuilder.group({
            origin: '',
            destination: '',
            startDate: '',
            startTime: ''
        })
    }

    onSubmit(routeData){
        this.apicallservice.postAPIData(routeData).subscribe((response)=>{
            response = JSON.stringify(response);
            this.router.navigate(['/route'], {queryParams: {origin: routeData.origin, destination: routeData.destination, itinerary: response}});
        }, (error)=>{
            this.router.navigate(['/route'], {queryParams: {route: error}});
            console.log(error);
        });
    }
}
