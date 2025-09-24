import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CargoShipmentService {
  prefixUrl = 'https://azurespringbootmicroservice-duczecgzdze8a9cf.swedencentral-01.azurewebsites.net/qneould/api/v1';
  postfixUrl = '?a=neo';
  headers = new HttpHeaders().set('Accept-Language', 'en');
  constructor(private readonly http: HttpClient) {}

  getDashboardDetail(): Observable<any> {
    // return this.http
    //   .get<any>(`${this.prefixUrl}/dashboard${this.postfixUrl}`, {
    //     headers: this.headers,
    //   })
    //   .pipe(
    //     map((response) => response),
    //     catchError((error: HttpErrorResponse) => throwError(() => error))
    //   );
    return of({
      totalShipments: 847,
      totalShipmentUpDown: '+12% from yesterday',
      onTimePerformance: 92.38,
      onTimePerformanceUpDown: '+3.2% this week',
      revenue: 12.8,
      revenueUpDown: '+8.5% vs last month',
      activeAlerts: 5,
      activeAlertsUpDown: '-15% from last hour',
    });
  }

  getRevenueOptimizationDetail() {
    return this.http
      .get<any>(`${this.prefixUrl}/revenue-optimisation${this.postfixUrl}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
    // return of({
    //   revenue: '1.5',
    //   totalRequest: 32,
    //   revenueOptimization: 80,
    //   revenueData: [
    //     { category: 'Electronics', value: 45 },
    //     { category: 'Pharmaceuticals', value: 25 },
    //     { category: 'Automotive', value: 20 },
    //     { category: 'Others', value: 10 },
    //   ],
    //   uldAvailability: [
    //     {
    //       type: 'AKE',
    //       percentage: 85,
    //       label: 'Available: 12',
    //       color: '#10b981',
    //       iconColor: '#9ca3af',
    //     },
    //     {
    //       type: 'LD3',
    //       percentage: 45,
    //       label: 'Available: 5',
    //       color: '#10b981',
    //       iconColor: '#f59e0b',
    //     },
    //     {
    //       type: 'LD3',
    //       percentage: 70,
    //       label: 'In Use: 5',
    //       color: '#10b981',
    //       iconColor: '#9ca3af',
    //     },
    //     {
    //       type: 'PMC',
    //       percentage: 25,
    //       label: 'Limited',
    //       color: '#f59e0b',
    //       iconColor: '#9ca3af',
    //     },
    //   ],
    //   areaRevenueData: [
    //     { x: '50', y: 20 },
    //     { x: '100', y: 35 },
    //     { x: '042', y: 15 },
    //     { x: '350', y: 25 },
    //     { x: '1005', y: 30 },
    //     { x: '600', y: 22 },
    //   ],
    //   areaProfitData: [
    //     { x: '50', y: 10 },
    //     { x: '100', y: 18 },
    //     { x: '042', y: 12 },
    //     { x: '350', y: 20 },
    //     { x: '1005', y: 16 },
    //     { x: '600', y: 14 },
    //   ],
    // });
  }

  getCargoDelayMonitorDetail() {
    return this.http
      .get<any>(`${this.prefixUrl}/delay-monitor${this.postfixUrl}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
    // return of({
    //   trendData: [
    //     {
    //       time: '00:00',
    //       delays: 12,
    //       onTime: 45,
    //     },
    //     {
    //       time: '04:00',
    //       delays: 8,
    //       onTime: 52,
    //     },
    //     {
    //       time: '08:00',
    //       delays: 25,
    //       onTime: 38,
    //     },
    //     {
    //       time: '12:00',
    //       delays: 18,
    //       onTime: 42,
    //     },
    //     {
    //       time: '16:00',
    //       delays: 30,
    //       onTime: 35,
    //     },
    //     {
    //       time: '20:00',
    //       delays: 22,
    //       onTime: 40,
    //     },
    //     {
    //       time: '24:00',
    //       delays: 15,
    //       onTime: 48,
    //     },
    //   ],
    //   activeFlights: [
    //     {
    //       number: 'FLT-789',
    //       route: 'LAX to JFK',
    //       scheduled: '14:30',
    //       delay: '45m',
    //       status: 'Delayed',
    //       severity: 'warning',
    //     },
    //     {
    //       number: 'FLT-456',
    //       route: 'ORD to MIA',
    //       scheduled: '16:15',
    //       delay: '25m',
    //       status: 'Minor Delay',
    //       severity: 'info',
    //     },
    //     {
    //       number: 'FLT-123',
    //       route: 'DEN to SEA',
    //       scheduled: '18:00',
    //       delay: '60m',
    //       status: 'Critical',
    //       severity: 'danger',
    //     },
    //   ],
    //   problemAreas: [
    //     {
    //       location: 'Northeast US',
    //       incidents: 12,
    //       level: 'high',
    //     },
    //     {
    //       location: 'Central Europe',
    //       incidents: 8,
    //       level: 'medium',
    //     },
    //     {
    //       location: 'Asia Pacific',
    //       incidents: 15,
    //       level: 'high',
    //     },
    //     {
    //       location: 'Middle East',
    //       incidents: 5,
    //       level: 'low',
    //     },
    //   ],
    //   delayReasons: [
    //     {
    //       reason: 'Weather',
    //       percentage: 30,
    //     },
    //     {
    //       reason: 'Ground Handling',
    //       percentage: 25,
    //     },
    //     {
    //       reason: 'Customs',
    //       percentage: 20,
    //     },
    //     {
    //       reason: 'Mechanical',
    //       percentage: 15,
    //     },
    //     {
    //       reason: 'Other',
    //       percentage: 10,
    //     },
    //   ],
    // });
  }

  getPredictiveAnalysisDetail() {
    return this.http
      .get<any>(`${this.prefixUrl}/delay-prediction${this.postfixUrl}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
    // return of({
    //   delayPredictionData: [
    //     {
    //       time: '06:00',
    //       potential: 15,
    //     },
    //     {
    //       time: '09:00',
    //       potential: 35,
    //     },
    //     {
    //       time: '12:00',
    //       potential: 28,
    //     },
    //     {
    //       time: '15:00',
    //       potential: 42,
    //     },
    //     {
    //       time: '18:00',
    //       potential: 31,
    //     },
    //     {
    //       time: '21:00',
    //       potential: 18,
    //     },
    //   ],
    //   riskData: [
    //     {
    //       category: 'Weather',
    //       value: 35,
    //     },
    //     {
    //       category: 'Traffic',
    //       value: 25,
    //     },
    //     {
    //       category: 'Operational',
    //       value: 25,
    //     },
    //     {
    //       category: 'Other',
    //       value: 15,
    //     },
    //   ],
    //   recommendations: [
    //     {
    //       icon: '🔄',
    //       title: 'Route Optimization',
    //       description: 'Consider alternate routes for flights FLT-456, FLT-789',
    //       priority: 'high',
    //     },
    //     {
    //       icon: '📦',
    //       title: 'ULD Reallocation',
    //       description:
    //         'Redistribute cargo load to optimize weight distribution',
    //       priority: 'medium',
    //     },
    //     {
    //       icon: '⚡',
    //       title: 'Priority Handling',
    //       description: 'Fast-track high-value shipments through customs',
    //       priority: 'high',
    //     },
    //   ],
    // });
  }

  getForeCastChartData() {
    return of([
      {
        depDate: new Date('2025-08-01'),
        uldCount: 12,
        orig: 'DOH',
        dest: 'AMS',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 366,
        wt: 11428.59,
        vol: 62.456,
        pmc: 8,
        qke: 2,
        blk: 1,
        pla: 1,
        pkc: 0,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depDate: new Date('2025-08-02'),
        uldCount: 3,
        orig: 'DOH',
        dest: 'HYD',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 80,
        wt: 5175.84,
        vol: 33.38,
        pmc: 2,
        qke: 0,
        blk: 0,
        pla: 1,
        pkc: 0,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depDate: new Date('2025-08-03'),
        uldCount: 3,
        orig: 'DOH',
        dest: 'LHR',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 404,
        wt: 2830.2,
        vol: 16.94,
        pmc: 2,
        qke: 0,
        blk: 0,
        pla: 1,
        pkc: 0,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depDate: new Date('2025-08-04'),
        uldCount: 15,
        orig: 'DOH',
        dest: 'FRA',
        carEqpTyp: '77D',
        cgoCtgry: 'FREIGHT',
        pcs: 520,
        wt: 8750.3,
        vol: 45.2,
        pmc: 6,
        qke: 3,
        blk: 2,
        pla: 2,
        pkc: 1,
        alf: 1,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depDate: new Date('2025-08-05'),
        uldCount: 8,
        orig: 'DOH',
        dest: 'CDG',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 280,
        wt: 6420.8,
        vol: 38.7,
        pmc: 4,
        qke: 1,
        blk: 1,
        pla: 2,
        pkc: 0,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
    ]);
  }
}
