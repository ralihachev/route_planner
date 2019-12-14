import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route } from '../models/route';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApicallService {

    constructor(private http: HttpClient) { }

    postAPIData(route: Route[]){
        return this.http.post('/api/getRoute', route).
            pipe(map((data: any)=>{
                return data;
            }), catchError(error => {
                return throwError('Something went wrong')
            }))
    }
}
