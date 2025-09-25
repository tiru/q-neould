import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationTooltipService,
  AreaSeriesService,
  CategoryService,
  ChartModule,
  LegendService,
  PieSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { CargoShipmentService } from '../service/cargo-shipment.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from '../../shared/loader/loader.component';
export interface Telemetry {
 temperature: {
   value: number;
   unit: string;
   range: { min: number; max: number };
   status: string;
 };
 batteryLevel: {
   value: number;
   unit: string;
   status: {
     text: string;
     remainingTimeEstimateHours: number;
   };
 };
 signalStrength: {
   value: string;
   status: string;
   lastSyncMinutesAgo: string;
 };
 currentLocation: {
   value: string;
   description: string;
   details: {
     gate: string;
     locationType: string;
   };
   updatedMinutesAgo: string;
 };
}
@Component({
  selector: 'app-revenue-optimization-test',
  standalone: true,
  imports: [CommonModule, AccumulationChartModule, ChartModule, FormsModule, HttpClientModule, LoaderComponent],
  providers: [
    PieSeriesService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    AreaSeriesService,
    CategoryService,
    TooltipService,
    LegendService,
    CargoShipmentService,
  ],
  templateUrl: './revenue-optimization.html',
  styleUrl: './revenue-optimization.scss',
})
export class RevenueOptimizationTestComponent {
   telemetryData: Telemetry = {
   temperature: {
     value: 4.8,
     unit: '°C',
     range: { min: -5, max: 25 },
     status: 'Optimal'
   },
   batteryLevel: {
     value: 94,
     unit: '%',
     status: {
       text: 'Good',
       remainingTimeEstimateHours: 9
     }
   },
   signalStrength: {
     value: 'Excellent',
     status: 'Good',
     lastSyncMinutesAgo: '8'
   },
   currentLocation: {
     value: 'LHR T4',
     description: 'London Heathrow Terminal 4',
     details: {
       gate: '12A',
       locationType: 'Cargo Hold'
     },
     updatedMinutesAgo: '3'
   }
 };

 

 journdata = {
   tempCompliance: '97.1%',
   systemUptime: '99.8%',
   gpsAccuracy: '98.9%',
   events: '19/20'
 };
isTrackenabled: boolean = false;
trackfunc() {
  this.isTrackenabled = true;
}
backtrackfunc() {
  this.isTrackenabled = false;
}
}

