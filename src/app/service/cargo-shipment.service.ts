import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargoShipmentService {

  constructor(private readonly http: HttpClient) { }

  getDashboardDetail(): Observable<any> {
     return this.http
      .get("https://airlinetraining.croamis.com/qneould/api/v1/dashboard?a=neo")
       .pipe(
         map((response) => response),
         catchError((error: HttpErrorResponse) => throwError(() => error))
     );
    // return of({
    //   "totalShipments": 847,
    //   "totalShipmentUpDown" : "+12% from yesterday",
    //   "onTimePerformance":92.38,
    //    "onTimePerformanceUpDown": "+3.2% this week",
    //   "revenue": 12.8,
    //   "revenueUpDown": "+8.5% vs last month",
    //   "activeAlerts": 5,
    //   "activeAlertsUpDown": "-15% from last hour"
    // });
  }

  getRevenueOptimizationDetail(){
    return this.http
      .get("https://airlinetraining.croamis.com/qneould/api/v1/revenue-optimisation?a=neo")
       .pipe(
         map((response) => response),
         catchError((error: HttpErrorResponse) => throwError(() => error))
     );
  }

  getCargoDelayMonitorDetail(){
   return this.http
      .get("https://airlinetraining.croamis.com/qneould/api/v1/delay-monitor?a=neo")
       .pipe(
         map((response) => response),
         catchError((error: HttpErrorResponse) => throwError(() => error))
     );
  }

  getPredictiveAnalysisDetail(){
    return this.http
      .get("https://airlinetraining.croamis.com//qneould/api/v1/delay-prediction?a=neo")
       .pipe(
         map((response) => response),
         catchError((error: HttpErrorResponse) => throwError(() => error))
     );
  }
}
