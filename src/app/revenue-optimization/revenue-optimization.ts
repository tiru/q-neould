import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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
interface UldLog {
 id: string;
 eventType: string;
 severity: 'low' | 'medium' | 'high' | 'critical';
 location: string;
 timestamp: string;
 notes?: string;
}
const LOGS: UldLog[] = [
 { "id": "1", "eventType": "Late Arrival", "severity": "medium", "location": "DOH", "timestamp": "2025-09-25T06:35:00+03:00", "notes": "10 mins late at bay A12" },
 { "id": "2", "eventType": "Temperature Alert", "severity": "high", "location": "DOH", "timestamp": "2025-09-25T03:10:00+03:00", "notes": "Pharma cargo +9°C" },
 { "id": "3", "eventType": "Temperature Alert", "severity": "critical", "location": "DOH", "timestamp": "2025-09-25T03:25:00+03:00", "notes": "Escalated to station manager" },
 { "id": "4", "eventType": "Released", "severity": "low", "location": "DOH", "timestamp": "2025-09-25T04:00:00+03:00", "notes": "Temp alarm closed" },
 { "id": "5", "eventType": "Location Update", "severity": "low", "location": "DOH", "timestamp": "2025-09-25T06:10:00+03:00", "notes": "Moved to cold room CR2" },
 { "id": "6", "eventType": "Loaded", "severity": "low", "location": "DOH", "timestamp": "2025-09-25T07:05:00+03:00", "notes": "Loaded to JFK" },
 { "id": "7", "eventType": "Unloaded", "severity": "low", "location": "JFK", "timestamp": "2025-09-25T15:10:00-04:00", "notes": "From QR701" },
 { "id": "8", "eventType": "Location Update", "severity": "low", "location": "JFK", "timestamp": "2025-09-25T15:30:00-04:00", "notes": "Arrived import hall" },
 { "id": "9", "eventType": "Late Arrival", "severity": "low", "location": "JFK", "timestamp": "2025-09-25T15:45:00-04:00", "notes": "Delay due to taxi congestion" },
 { "id": "10", "eventType": "Released", "severity": "low", "location": "JFK", "timestamp": "2025-09-25T16:10:00-04:00", "notes": "Cleared to forwarder" },
 { "id": "11", "eventType": "Shock Alert", "severity": "medium", "location": "LHR", "timestamp": "2025-09-24T22:18:00+01:00", "notes": "Ramp offload jolt" },
 { "id": "12", "eventType": "Damage Alert", "severity": "high", "location": "LHR", "timestamp": "2025-09-24T21:55:00+01:00", "notes": "Panel dent logged" },
 { "id": "13", "eventType": "Customs Hold", "severity": "medium", "location": "LHR", "timestamp": "2025-09-24T22:10:00+01:00", "notes": "Random inspection" },
 { "id": "14", "eventType": "Released", "severity": "low", "location": "LHR", "timestamp": "2025-09-25T01:30:00+01:00", "notes": "Hold cleared" },
 { "id": "15", "eventType": "Unloaded", "severity": "low", "location": "LHR", "timestamp": "2025-09-24T22:25:00+01:00", "notes": "From QR001" },
 { "id": "16", "eventType": "Late Arrival", "severity": "medium", "location": "DEL", "timestamp": "2025-09-21T23:10:00+05:30", "notes": "Weather delay" },
 { "id": "17", "eventType": "Location Update", "severity": "low", "location": "DEL", "timestamp": "2025-09-21T23:40:00+05:30", "notes": "Moved to export shed" },
 { "id": "18", "eventType": "Loaded", "severity": "low", "location": "DEL", "timestamp": "2025-09-22T01:20:00+05:30", "notes": "On QR571" },
 { "id": "19", "eventType": "Shock Alert", "severity": "medium", "location": "DXB", "timestamp": "2025-09-22T05:20:00+04:00", "notes": "Loader vibration" },
 { "id": "20", "eventType": "Damage Alert", "severity": "high", "location": "DXB", "timestamp": "2025-09-22T05:50:00+04:00", "notes": "Door seal torn" },
 { "id": "21", "eventType": "Location Update", "severity": "low", "location": "DXB", "timestamp": "2025-09-22T06:10:00+04:00", "notes": "Sent to repair bay" },
 { "id": "22", "eventType": "Location Update", "severity": "low", "location": "DOH", "timestamp": "2025-09-23T08:35:00+03:00", "notes": "Pre-cool in CR1" },
 { "id": "23", "eventType": "Temperature Alert", "severity": "medium", "location": "DOH", "timestamp": "2025-09-23T09:22:00+03:00", "notes": "Ambient spike on ramp" },
 { "id": "24", "eventType": "Location Update", "severity": "low", "location": "DOH", "timestamp": "2025-09-23T10:00:00+03:00", "notes": "To pharma room P2" },
 { "id": "25", "eventType": "Unloaded", "severity": "low", "location": "CDG", "timestamp": "2025-09-19T19:15:00+02:00", "notes": "From QR041" }
];

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
view: 'timeline' | 'journey' = 'timeline'

logs = signal<ReadonlyArray<UldLog>>(LOGS);
selectedTypes = signal<Set<string>>(new Set());
selectedLocs = signal<Set<string>>(new Set());
eventTypes = Array.from(new Set(LOGS.map(l => l.eventType)));
locations = Array.from(new Set(LOGS.map(l => l.location)));
filtered = computed(() =>
 this.logs().filter(l =>
   (!this.selectedTypes().size || this.selectedTypes().has(l.eventType)) &&
   (!this.selectedLocs().size || this.selectedLocs().has(l.location))
 )
);
toggleType(t: string) {
 if (t === 'All') {
   this.selectedTypes.set(new Set()); // reset
   return;
 }
 const s = new Set(this.selectedTypes());
 s.has(t) ? s.delete(t) : s.add(t);
 this.selectedTypes.set(s);
}
toggleLoc(l: string) {
 if (l === 'All') {
   this.selectedLocs.set(new Set()); // reset
   return;
 }
 const s = new Set(this.selectedLocs());
 s.has(l) ? s.delete(l) : s.add(l);
 this.selectedLocs.set(s);
}
clearFilters() {
 this.selectedTypes.set(new Set());
 this.selectedLocs.set(new Set());
}
countEvent(t: string) {
 if (t === 'All') return this.logs().length;
 return this.logs().filter(l => l.eventType === t).length;
}
countLoc(l: string) {
 if (l === 'All') return this.logs().length;
 return this.logs().filter(log => log.location === l).length;
}
toLocalTime(iso: string) {
 return new Date(iso).toLocaleString(undefined, {
   year: '2-digit', month: '2-digit', day: '2-digit',
   hour: '2-digit', minute: '2-digit'
 });
}

}

