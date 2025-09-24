import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

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
  selector: 'app-uld-tracking-map',
  templateUrl: './uld-tracking-map.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./uld-tracking-map.component.scss'],
})
export class UldTrackingMapComponent implements OnInit {
  @ViewChild('mapElement') mapElement!: ElementRef;

  private map!: L.Map;
  private currentPolylines: L.Polyline[] = [];
  private currentMarkers: any[] = [];

  // Sample data with latitude and longitude included
  private sampleData: ULDData[] = [
    {
      MOVEMENT_DATE: '24-Sep-25',
      ULD: 'AAA012300N',
      CARRIER_CODE: 'AA',
      CARRIER_NUMBER: '1234',
      ROUTE: 'LHR-DOH-MAA',
      DEP: 'LHR',
      ARR: 'DOH',
      DEP_DATE: '24-Sep-25',
      ULD_TYPE: 'CONTAINER',
      LEASE: 'Y',
      DAMAGED: 'N',
      IDLE: 'N',
      ACTUAL_TEMP: 77.94,
      CURRENT_TEMP: 77.94,
      BREACH_IND: 'N',
      ALERT: 'N',
      CRITICAL: 'Y',
      USE_IND: 'G',
      DEP_LAT: 51.47,
      DEP_LON: -0.4543,
      ARR_LAT: 25.2732,
      ARR_LON: 51.608,
    },
    {
      MOVEMENT_DATE: '25-Sep-25',
      ULD: 'AAA012300N',
      CARRIER_CODE: 'AA',
      CARRIER_NUMBER: '4567',
      ROUTE: 'LHR-DOH-MAA',
      DEP: 'DOH',
      ARR: 'MAA',
      DEP_DATE: '25-Sep-25',
      ULD_TYPE: 'CONTAINER',
      LEASE: 'Y',
      DAMAGED: 'N',
      IDLE: 'N',
      ACTUAL_TEMP: 77.94,
      CURRENT_TEMP: 71.94,
      BREACH_IND: 'N',
      ALERT: 'N',
      CRITICAL: 'Y',
      USE_IND: 'G',
      DEP_LAT: 25.2732,
      DEP_LON: 51.608,
      ARR_LAT: 12.9941,
      ARR_LON: 80.1709,
    },
    {
      MOVEMENT_DATE: '24-Sep-25',
      ULD: 'QKE620000N',
      CARRIER_CODE: 'AB',
      CARRIER_NUMBER: '8735',
      ROUTE: 'STN-CDG-BEY-DOH',
      DEP: 'STN',
      ARR: 'CDG',
      DEP_DATE: '24-Sep-25',
      ULD_TYPE: 'CONTAINER',
      LEASE: 'Y',
      DAMAGED: 'N',
      IDLE: 'N',
      ACTUAL_TEMP: 91.26,
      CURRENT_TEMP: 91.26,
      BREACH_IND: 'N',
      ALERT: 'N',
      CRITICAL: 'Y',
      USE_IND: 'G',
      DEP_LAT: 51.885,
      DEP_LON: 0.235,
      ARR_LAT: 49.0097,
      ARR_LON: 2.5479,
    },
    {
      MOVEMENT_DATE: '25-Sep-25',
      ULD: 'QKE620000N',
      CARRIER_CODE: 'QN',
      CARRIER_NUMBER: '8654',
      ROUTE: 'STN-CDG-BEY-DOH',
      DEP: 'CDG',
      ARR: 'BEY',
      DEP_DATE: '25-Sep-25',
      ULD_TYPE: 'CONTAINER',
      LEASE: 'N',
      DAMAGED: 'N',
      IDLE: 'N',
      ACTUAL_TEMP: 91.26,
      CURRENT_TEMP: 90.19,
      BREACH_IND: 'Y',
      ALERT: 'Y',
      CRITICAL: 'Y',
      USE_IND: 'R',
      DEP_LAT: 49.0097,
      DEP_LON: 2.5479,
      ARR_LAT: 33.8208,
      ARR_LON: 35.4883,
    },
    {
      MOVEMENT_DATE: '26-Sep-25',
      ULD: 'QKE620000N',
      CARRIER_CODE: 'QN',
      CARRIER_NUMBER: '8654',
      ROUTE: 'STN-CDG-BEY-DOH',
      DEP: 'BEY',
      ARR: 'DOH',
      DEP_DATE: '26-Sep-25',
      ULD_TYPE: 'CONTAINER',
      LEASE: 'N',
      DAMAGED: 'N',
      IDLE: 'N',
      ACTUAL_TEMP: 91.26,
      CURRENT_TEMP: 91.26,
      BREACH_IND: 'N',
      ALERT: 'N',
      CRITICAL: 'Y',
      USE_IND: 'G',
      DEP_LAT: 33.8208,
      DEP_LON: 35.4883,
      ARR_LAT: 25.2732,
      ARR_LON: 51.608,
    },
  ];

  selectedULDType: string = '';
  selectedULDNumber: string = '';
  selectedSegment: RouteSegment | null = null;

  uldTypes: string[] = [
    'CONTAINER',
    'PALLET',
    'IGLOO',
    'BOX',
    'TANK',
    'REEFER',
  ];
  filteredULDs: ULDOption[] = [];

  private allULDs: ULDOption[] = [
    { value: 'AAA012300N', label: 'AAA012300N - Container', type: 'CONTAINER' },
    { value: 'QKE620000N', label: 'QKE620000N - Container', type: 'CONTAINER' },
    { value: 'PKE123456N', label: 'PKE123456N - Pallet', type: 'PALLET' },
    { value: 'IGU789012N', label: 'IGU789012N - Igloo', type: 'IGLOO' },
    { value: 'BOX345678N', label: 'BOX345678N - Box', type: 'BOX' },
    { value: 'TNK901234N', label: 'TNK901234N - Tank', type: 'TANK' },
    { value: 'REF567890N', label: 'REF567890N - Reefer', type: 'REEFER' },
  ];

  ngOnInit() {
    this.filteredULDs = this.allULDs;
  }

  ngAfterViewInit() {
    this.initializeMap();
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap() {
    // Initialize map centered on world view
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

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.map);

    // Set custom marker icons
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

  onULDTypeChange() {
    if (this.selectedULDType) {
      this.filteredULDs = this.allULDs.filter(
        (uld) => uld.type === this.selectedULDType
      );
    } else {
      this.filteredULDs = this.allULDs;
    }
    this.selectedULDNumber = '';
    this.clearMap();
  }

  onULDNumberChange() {
    if (this.selectedULDNumber) {
      this.displayRouteOnMap();
    } else {
      this.clearMap();
    }
  }

  private displayRouteOnMap() {
    this.clearMap();

    if (!this.selectedULDNumber) return;

    const uldData = this.sampleData.filter(
      (data) => data.ULD === this.selectedULDNumber
    );

    if (uldData.length === 0) return;

    const segments = this.parseRouteSegments(uldData);
    this.drawRouteSegments(segments);

    // Fit map to show all segments
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
      // Use latitude and longitude directly from the data
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
      // Create polyline for route
      const polyline = L.polyline([segment.fromCoords, segment.toCoords], {
        color: segment.color,
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(this.map);

      // Add click event to polyline
      polyline.on('click', () => {
        this.selectedSegment = segment;
      });

      this.currentPolylines.push(polyline);

      // Create markers for airports
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

      // Add click events to markers
      fromMarker.on('click', () => {
        this.selectedSegment = segment;
      });

      toMarker.on('click', () => {
        this.selectedSegment = segment;
      });

      // Add tooltips
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

    // Add custom CSS for tooltips
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
    // Remove all polylines
    this.currentPolylines.forEach((polyline) => {
      this.map.removeLayer(polyline);
    });
    this.currentPolylines = [];

    // Remove all markers
    this.currentMarkers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.currentMarkers = [];

    // Clear selected segment
    this.selectedSegment = null;
  }

  refreshMap() {
    if (this.selectedULDNumber) {
      this.displayRouteOnMap();
    } else {
      this.clearMap();
    }
  }

  closeInfoPanel() {
    this.selectedSegment = null;
  }

  getTempPercentage(): number {
    if (!this.selectedSegment) return 50;
    const current = this.selectedSegment.data.CURRENT_TEMP;
    const target = this.selectedSegment.data.ACTUAL_TEMP;
    const minTemp = target - 20;
    const maxTemp = target + 20;
    const percentage = ((current - minTemp) / (maxTemp - minTemp)) * 100;

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, percentage));
  }
}
