import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { catchError, map, throwError } from 'rxjs';
import { LoaderComponent } from 'src/shared/loader/loader.component';

interface ULDData {
  MOVEMENT_DATE: string;
  ULD: string;
  CARRIER_CODE: string;
  CARRIER_NUMBER: string;
  ROUTE: string;
  DEP: string;
  ARR: string;
  DEP_DATE: string;
  ULD_TYPE: string;
  LEASE: string;
  DAMAGED: string;
  IDLE: string;
  ACTUAL_TEMP: number;
  CURRENT_TEMP: number;
  BREACH_IND: string;
  ALERT: string;
  CRITICAL: string;
  USE_IND: string;
  DEP_LAT: number;
  DEP_LON: number;
  ARR_LAT: number;
  ARR_LON: number;
  BATTERY: number;
  SIGNAL: number;
}

interface RouteSegment {
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  color: string;
  data: ULDData;
}

interface ULDOption {
  value: string;
  label: string;
  type: string;
}

@Component({
  selector: 'app-uld-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LoaderComponent],
  templateUrl: './uld-tracking-map.component.html',
  styleUrls: ['./uld-tracking-map.component.scss'],
})
export class UldTrackingMapComponent implements OnInit {
  @ViewChild('mapElement') mapElement!: ElementRef;

  currentView: 'search' | 'details' = 'search';
  searchULD: string = '';
  currentULD: string = '';
  currentULDType: string = '';
  currentLocation: string = '';
  currentULDData: ULDData | null = null;
  loader = false;

  private map!: L.Map;
  private currentPolylines: L.Polyline[] = [];
  private currentMarkers: any[] = [];
  selectedSegment: RouteSegment | null = null;

  prefixURL =
    'https://azurespringbootmicroservice-duczecgzdze8a9cf.swedencentral-01.azurewebsites.net/qneould/uld-tracking/api/v1';
  private sampleData: ULDData[] = [];

  sampleULDs: any = [
    // { value: 'AKE33366QN', label: 'AKE Container', type: 'CONTAINER' },
    // { value: 'PMC284710R', label: 'PMC Container', type: 'CONTAINER' },
    // { value: 'AKH159230R', label: 'AKH Container', type: 'CONTAINER' },
    // { value: 'LD3218470R', label: 'LD3 Container', type: 'CONTAINER' },
  ];

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.getULDTrackingNumberDetail();
  }

  ngAfterViewInit() {
    // Map will be initialized when switching to details view
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  getULDTrackingNumberDetail() {
    this.loader = true;
    return this.http
      .get<any>(`${this.prefixURL}/top-ulds`)
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => throwError(() => error))
      )
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.loader = false;
          this.sampleULDs = data?.map((item: any) => item.ULD);
        }
      });
  }

  trackULD() {
    if (!this.searchULD.trim()) return;

    // Immediately switch to details view
    this.currentULD = this.searchULD.trim();
    this.currentView = 'details';

    // Set loading/default data first
    this.currentULDType = 'Container';
    this.currentLocation = 'Loading...';

    // Initialize map immediately
    setTimeout(() => {
      this.initializeMap();
    }, 50);

    // Then fetch the actual data
    this.getAllULDTrackingNumber(this.searchULD.trim());
  }

  selectSampleULD(uldNumber: string) {
    this.searchULD = uldNumber;

    // Immediately switch to details view
    this.currentULD = uldNumber;
    this.currentView = 'details';

    // Set loading/default data first
    this.currentULDType = 'Container';
    this.currentLocation = 'Loading...';

    // Initialize map immediately
    setTimeout(() => {
      this.initializeMap();
    }, 50);

    // Then fetch the actual data
    this.getAllULDTrackingNumber(uldNumber);
  }

  getAllULDTrackingNumber(trackingId: string) {
    this.loader = true;
    return this.http
      .get<any>(`${this.prefixURL}/track?uld=${trackingId}`)
      .pipe(
        map((response) => response),
        catchError((error: HttpErrorResponse) => {
          // Handle error - could show error message or fallback data
          console.error('Error fetching ULD data:', error);
          this.loadMockData(trackingId);
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.loader = false;
          this.sampleData = data;
          this.currentULDData = data[0];
          this.currentULDType = data[0].ULD_TYPE || 'Container';
          this.currentLocation = this.getCurrentLocationFromData(data[0]);

          // Update map with real data
          this.displayRouteOnMap();
        } else {
          // Load mock data if no real data available
          this.loadMockData(trackingId);
        }
      });
  }

  private loadMockData(uldNumber: string) {
    // Create mock data for demo purposes
    const mockData: ULDData = {
      MOVEMENT_DATE: new Date().toISOString().split('T')[0],
      ULD: uldNumber,
      CARRIER_CODE: 'QR',
      CARRIER_NUMBER: '123',
      ROUTE: 'DOH-LHR',
      DEP: 'DOH',
      ARR: 'LHR',
      DEP_DATE: new Date().toISOString().split('T')[0],
      ULD_TYPE: 'AKE Container',
      LEASE: 'Y',
      DAMAGED: 'N',
      IDLE: 'N',
      ACTUAL_TEMP: 4,
      CURRENT_TEMP: 4.8,
      BREACH_IND: 'N',
      ALERT: 'N',
      CRITICAL: 'N',
      USE_IND: 'G',
      DEP_LAT: 25.273056,
      DEP_LON: 51.608056,
      ARR_LAT: 51.4775,
      ARR_LON: -0.461389,
      BATTERY: 94,
      SIGNAL: 89,
    };

    this.sampleData = [mockData];
    this.currentULDData = mockData;
    this.currentULDType = mockData.ULD_TYPE;
    this.currentLocation = 'LHR T4';

    // Update map with mock data
    this.displayRouteOnMap();
  }

  getCurrentLocationFromData(data: ULDData): string {
    // Mock location based on departure/arrival
    const locations = [
      'LHR T4',
      'JFK Terminal 1',
      'DXB Terminal 3',
      'CDG Terminal 2',
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  goBack() {
    this.currentView = 'search';
    this.selectedSegment = null;
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap() {
    if (this.mapElement) {
      this.map = L.map(this.mapElement.nativeElement, {
        center: [25.0, 25.0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(this.map);

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }

  private displayRouteOnMap() {
    this.clearMap();
    if (!this.currentULD || !this.map) return;

    const uldData = this.sampleData.filter(
      (data) => data.ULD === this.currentULD
    );
    if (uldData.length === 0) return;

    const segments = this.parseRouteSegments(uldData);
    this.drawRouteSegments(segments);

    if (segments.length > 0) {
      const bounds = L.latLngBounds(
        segments.flatMap((s) => [s.fromCoords, s.toCoords])
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private parseRouteSegments(uldData: ULDData[]): RouteSegment[] {
    const segments: RouteSegment[] = [];
    uldData.forEach((data) => {
      const fromCoords: [number, number] = [data.DEP_LAT, data.DEP_LON];
      const toCoords: [number, number] = [data.ARR_LAT, data.ARR_LON];
      segments.push({
        from: data.DEP,
        to: data.ARR,
        fromCoords: fromCoords,
        toCoords: toCoords,
        color: data.USE_IND === 'G' ? '#10b981' : '#ef4444',
        data: data,
      });
    });
    return segments;
  }

  private drawRouteSegments(segments: RouteSegment[]) {
    segments.forEach((segment) => {
      const polyline = L.polyline([segment.fromCoords, segment.toCoords], {
        color: segment.color,
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(this.map);

      polyline.on('click', () => {
        this.selectedSegment = segment;
      });
      this.currentPolylines.push(polyline);

      const fromMarker = L.circleMarker(segment.fromCoords, {
        radius: 8,
        fillColor: segment.color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(this.map);

      const toMarker = L.circleMarker(segment.toCoords, {
        radius: 8,
        fillColor: segment.color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(this.map);

      fromMarker.on('click', () => {
        this.selectedSegment = segment;
      });

      toMarker.on('click', () => {
        this.selectedSegment = segment;
      });

      fromMarker.bindTooltip(`${segment.from}`, {
        permanent: true,
        direction: 'top',
        className: 'airport-tooltip',
      });

      toMarker.bindTooltip(`${segment.to}`, {
        permanent: true,
        direction: 'top',
        className: 'airport-tooltip',
      });

      this.currentMarkers.push(fromMarker, toMarker);
    });

    this.addTooltipStyles();
  }

  private addTooltipStyles() {
    if (!document.getElementById('custom-tooltip-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-tooltip-styles';
      style.textContent = `
        .airport-tooltip {
          background: rgba(0,0,0,0.8) !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          font-size: 12px !important;
          font-weight: bold !important;
        }
        .airport-tooltip::before {
          border-top-color: rgba(0,0,0,0.8) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private clearMap() {
    this.currentPolylines.forEach((polyline) => {
      this.map.removeLayer(polyline);
    });
    this.currentPolylines = [];

    this.currentMarkers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.currentMarkers = [];

    this.selectedSegment = null;
  }

  closeInfoPanel() {
    this.selectedSegment = null;
  }

  isTemperatureOptimal(): boolean {
    if (!this.currentULDData) return true;
    const diff = Math.abs(
      this.currentULDData.CURRENT_TEMP - this.currentULDData.ACTUAL_TEMP
    );
    return diff <= 2; // Within 2 degrees is optimal
  }

  getSignalStrength(): string {
    if (!this.currentULDData) return 'Unknown';
    const signal = this.currentULDData.SIGNAL;
    if (signal > 80) return 'Excellent';
    if (signal > 50) return 'Good';
    if (signal > 20) return 'Fair';
    return 'Poor';
  }

  getSignalStatus(): string {
    if (!this.currentULDData) return 'Unknown';
    const signal = this.currentULDData.SIGNAL;
    if (signal > 80) return 'Excellent';
    if (signal > 50) return 'Good';
    return 'Poor';
  }

  getLocationDetails(): string {
    if (!this.currentULDData) return '';
    return `Gate 12A • Cargo Hold • Updated 3 min ago`;
  }

  getTempPercentage(): number {
    if (!this.selectedSegment) return 50;
    const current = this.selectedSegment.data.CURRENT_TEMP;
    const target = this.selectedSegment.data.ACTUAL_TEMP;
    const minTemp = target - 20;
    const maxTemp = target + 20;
    const percentage = ((current - minTemp) / (maxTemp - minTemp)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }
}
