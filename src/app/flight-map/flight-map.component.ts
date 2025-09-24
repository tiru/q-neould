import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { HttpClientModule } from '@angular/common/http';

export interface FlightRoute {
  id: string;
  origin: {
    name: string;
    code: string;
    lat: number;
    lng: number;
  };
  destination: {
    name: string;
    code: string;
    lat: number;
    lng: number;
  };
  flightNumber: string;
  cargoWeight: string;
  status: 'scheduled' | 'in-flight' | 'arrived' | 'delayed';
  progress?: number;
}

@Component({
  selector: 'app-flight-map',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './flight-map.component.html',
  styleUrl: './flight-map.component.scss',
})
export class FlightMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private routeLines: Map<string, L.Polyline> = new Map();
  private airportMarkers: Map<string, L.Marker> = new Map();
  private airplaneMarkers: Map<string, L.Marker> = new Map();

  flightRoutes: FlightRoute[] = [];
  selectedRouteId: string | null = null;
  animationActive = false;
  panelVisible = false;
  private animationInterval: any;

  // Major airports for random flight generation
  private majorAirports = [
    { name: 'New York JFK', code: 'JFK', lat: 40.6413, lng: -73.7781 },
    { name: 'London Heathrow', code: 'LHR', lat: 51.47, lng: -0.4543 },
    { name: 'Tokyo Narita', code: 'NRT', lat: 35.772, lng: 140.3928 },
    { name: 'Los Angeles', code: 'LAX', lat: 33.9425, lng: -118.4081 },
    { name: 'Dubai', code: 'DXB', lat: 25.2532, lng: 55.3657 },
    { name: 'Singapore', code: 'SIN', lat: 1.3644, lng: 103.9915 },
    { name: 'Frankfurt', code: 'FRA', lat: 50.0379, lng: 8.5622 },
    { name: 'Paris CDG', code: 'CDG', lat: 49.0097, lng: 2.5479 },
    { name: 'Amsterdam', code: 'AMS', lat: 52.3105, lng: 4.7683 },
    { name: 'Hong Kong', code: 'HKG', lat: 22.308, lng: 113.9185 },
    { name: 'Sydney', code: 'SYD', lat: -33.9399, lng: 151.1753 },
    { name: 'Mumbai', code: 'BOM', lat: 19.0896, lng: 72.8656 },
  ];

  newRoute: FlightRoute = {
    id: '',
    origin: { name: '', code: '', lat: 0, lng: 0 },
    destination: { name: '', code: '', lat: 0, lng: 0 },
    flightNumber: '',
    cargoWeight: '',
    status: 'scheduled',
  };

  ngOnInit() {
    this.loadSampleRoutes();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 100);
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize() {
    this.panelVisible = window.innerWidth > 768;
  }

  private initializeMap() {
    this.map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.renderAllRoutes();

    // Auto-start animation for demo
    // setTimeout(() => {
    //   this.toggleAnimation();
    // }, 2000);
  }

  private loadSampleRoutes() {
    this.flightRoutes = [
      {
        id: '1',
        flightNumber: 'CA001',
        cargoWeight: '15.5 tons',
        origin: {
          name: 'New York JFK',
          code: 'JFK',
          lat: 40.6413,
          lng: -73.7781,
        },
        destination: {
          name: 'London Heathrow',
          code: 'LHR',
          lat: 51.47,
          lng: -0.4543,
        },
        status: 'in-flight',
        progress: 42,
      },
      {
        id: '2',
        flightNumber: 'CA002',
        cargoWeight: '22.3 tons',
        origin: {
          name: 'Tokyo Narita',
          code: 'NRT',
          lat: 35.772,
          lng: 140.3928,
        },
        destination: {
          name: 'Los Angeles',
          code: 'LAX',
          lat: 33.9425,
          lng: -118.4081,
        },
        status: 'in-flight',
        progress: 78,
      },
      {
        id: '3',
        flightNumber: 'CA003',
        cargoWeight: '18.7 tons',
        origin: { name: 'Dubai', code: 'DXB', lat: 25.2532, lng: 55.3657 },
        destination: {
          name: 'Mumbai',
          code: 'BOM',
          lat: 19.0896,
          lng: 72.8656,
        },
        status: 'in-flight',
        progress: 28,
      },
      {
        id: '4',
        flightNumber: 'CA004',
        cargoWeight: '31.2 tons',
        origin: { name: 'Frankfurt', code: 'FRA', lat: 50.0379, lng: 8.5622 },
        destination: {
          name: 'Singapore',
          code: 'SIN',
          lat: 1.3644,
          lng: 103.9915,
        },
        status: 'in-flight',
        progress: 65,
      },
      {
        id: '5',
        flightNumber: 'CA005',
        cargoWeight: '26.8 tons',
        origin: { name: 'Sydney', code: 'SYD', lat: -33.9399, lng: 151.1753 },
        destination: {
          name: 'Hong Kong',
          code: 'HKG',
          lat: 22.308,
          lng: 113.9185,
        },
        status: 'scheduled',
      },
    ];
  }

  addRoute() {
    if (this.validateRoute()) {
      this.newRoute.id = Date.now().toString();
      this.flightRoutes.push({ ...this.newRoute });
      this.renderRoute(this.newRoute);
      this.resetForm();
    }
  }

  addRandomFlight() {
    const airports = this.majorAirports;
    const origin = airports[Math.floor(Math.random() * airports.length)];
    let destination = airports[Math.floor(Math.random() * airports.length)];

    // Ensure destination is different from origin
    while (destination.code === origin.code) {
      destination = airports[Math.floor(Math.random() * airports.length)];
    }

    const flightNumber = `CA${String(Math.floor(Math.random() * 999) + 100)}`;
    const cargoWeight = `${(Math.random() * 30 + 10).toFixed(1)} tons`;
    const statuses: ('scheduled' | 'in-flight' | 'delayed')[] = [
      'scheduled',
      'in-flight',
      'delayed',
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const newRoute: FlightRoute = {
      id: Date.now().toString(),
      flightNumber,
      cargoWeight,
      origin,
      destination,
      status,
      progress:
        status === 'in-flight' ? Math.floor(Math.random() * 90) + 5 : undefined,
    };

    this.flightRoutes.push(newRoute);
    this.renderRoute(newRoute);
  }

  private validateRoute(): boolean {
    return (
      this.newRoute.flightNumber.trim() !== '' &&
      this.newRoute.origin.name.trim() !== '' &&
      this.newRoute.destination.name.trim() !== '' &&
      this.newRoute.origin.lat !== 0 &&
      this.newRoute.origin.lng !== 0 &&
      this.newRoute.destination.lat !== 0 &&
      this.newRoute.destination.lng !== 0
    );
  }

  private resetForm() {
    this.newRoute = {
      id: '',
      origin: { name: '', code: '', lat: 0, lng: 0 },
      destination: { name: '', code: '', lat: 0, lng: 0 },
      flightNumber: '',
      cargoWeight: '',
      status: 'scheduled',
    };
  }

  removeRoute(routeId: string) {
    this.flightRoutes = this.flightRoutes.filter(
      (route) => route.id !== routeId
    );
    this.removeRouteFromMap(routeId);
    if (this.selectedRouteId === routeId) {
      this.selectedRouteId = null;
    }
  }

  selectRoute(routeId: string) {
    this.selectedRouteId = routeId;
    this.panelVisible = false;
    const route = this.flightRoutes.find((r) => r.id === routeId);
    if (route && this.map) {
      const bounds = L.latLngBounds([
        [route.origin.lat, route.origin.lng],
        [route.destination.lat, route.destination.lng],
      ]);
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  togglePanel() {
    this.panelVisible = !this.panelVisible;
  }

  getFlightsByStatus(status: string): FlightRoute[] {
    return this.flightRoutes.filter((route) => route.status === status);
  }

  private renderAllRoutes() {
    if (!this.map) return;
    this.flightRoutes.forEach((route) => {
      this.renderRoute(route);
    });
  }

  private renderRoute(route: FlightRoute) {
    if (!this.map) return;

    this.createAirportMarker(route.origin, route.id + '_origin');
    this.createAirportMarker(route.destination, route.id + '_dest');
    this.createRouteLine(route);

    if (route.status === 'in-flight') {
      this.createAirplaneMarker(route);
    }
  }

  private createAirportMarker(airport: any, markerId: string) {
    if (this.airportMarkers.has(markerId)) return;

    const airportIcon = L.divIcon({
      html: `<div style="background: #e74c3c; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'airport-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const marker = L.marker([airport.lat, airport.lng], { icon: airportIcon })
      .bindPopup(
        `<strong>${airport.name} (${airport.code})</strong><br>Airport`
      )
      .addTo(this.map);

    this.airportMarkers.set(markerId, marker);
  }

  private createRouteLine(route: FlightRoute) {
    const routeLine = L.polyline(
      [
        [route.origin.lat, route.origin.lng],
        [route.destination.lat, route.destination.lng],
      ],
      {
        color: this.getRouteColor(route.status),
        weight: 3,
        opacity: 0.8,
        dashArray: route.status === 'scheduled' ? '5, 5' : undefined,
      }
    ).addTo(this.map);

    routeLine.bindPopup(`
      <strong>Flight ${route.flightNumber}</strong><br>
      ${route.origin.code} → ${route.destination.code}<br>
      Cargo: ${route.cargoWeight}<br>
      Status: ${route.status}
    `);

    this.routeLines.set(route.id, routeLine);
  }

  private createAirplaneMarker(route: FlightRoute) {
    const progress = route.progress || 0;
    const lat =
      route.origin.lat +
      (route.destination.lat - route.origin.lat) * (progress / 100);
    const lng =
      route.origin.lng +
      (route.destination.lng - route.origin.lng) * (progress / 100);

    // Calculate the bearing/angle from origin to destination
    const bearing = this.calculateBearing(
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng
    );

    const airplaneIcon = L.divIcon({
      html: `
        <div style="
          width: 32px; 
          height: 32px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transform: rotate(${bearing}deg);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" 
                  fill="#2563eb" stroke="#1e40af" stroke-width="1"/>
          </svg>
        </div>
      `,
      className: 'airplane-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([lat, lng], { icon: airplaneIcon })
      .bindPopup(
        `
        <div style="min-width: 150px;">
          <strong>✈️ Flight ${route.flightNumber}</strong><br>
          <div style="margin: 8px 0;">
            <span style="color: #666;">Progress:</span> 
            <strong style="color: #2563eb;">${progress}%</strong>
          </div>
          <div style="margin: 8px 0;">
            <span style="color: #666;">Cargo:</span> 
            <strong style="color: #e67e22;">${route.cargoWeight}</strong>
          </div>
          <div style="margin: 8px 0; font-size: 12px; color: #666;">
            ${route.origin.code} → ${route.destination.code}
          </div>
        </div>
      `
      )
      .addTo(this.map);

    this.airplaneMarkers.set(route.id, marker);
  }

  private calculateBearing(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360; // Normalize to 0-360 degrees
  }

  private getRouteColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return '#95a5a6';
      case 'in-flight':
        return '#00b894';
      case 'arrived':
        return '#6c5ce7';
      case 'delayed':
        return '#e17055';
      default:
        return '#3498db';
    }
  }

  private removeRouteFromMap(routeId: string) {
    // Remove route line
    const routeLine = this.routeLines.get(routeId);
    if (routeLine) {
      this.map.removeLayer(routeLine);
      this.routeLines.delete(routeId);
    }

    // Remove airplane marker
    const airplaneMarker = this.airplaneMarkers.get(routeId);
    if (airplaneMarker) {
      this.map.removeLayer(airplaneMarker);
      this.airplaneMarkers.delete(routeId);
    }

    // Remove airport markers (only if not used by other routes)
    const originMarkerId = routeId + '_origin';
    const destMarkerId = routeId + '_dest';

    [originMarkerId, destMarkerId].forEach((markerId) => {
      const marker = this.airportMarkers.get(markerId);
      if (marker) {
        this.map.removeLayer(marker);
        this.airportMarkers.delete(markerId);
      }
    });
  }

  fitToRoutes() {
    if (this.flightRoutes.length === 0 || !this.map) return;

    const bounds = L.latLngBounds([]);
    this.flightRoutes.forEach((route) => {
      bounds.extend([route.origin.lat, route.origin.lng]);
      bounds.extend([route.destination.lat, route.destination.lng]);
    });

    this.map.fitBounds(bounds, { padding: [20, 20] });
  }

  resetView() {
    if (this.map) {
      this.map.setView([20, 0], 2);
    }
  }

  toggleAnimation() {
    if (this.animationActive) {
      clearInterval(this.animationInterval);
      this.animationActive = false;
    } else {
      this.startAnimation();
      this.animationActive = true;
    }
  }

  private startAnimation() {
    this.animationInterval = setInterval(() => {
      this.flightRoutes.forEach((route) => {
        if (route.status === 'in-flight') {
          route.progress = (route.progress || 0) + 1;
          if (route.progress >= 100) {
            route.progress = 100;
            route.status = 'arrived';
            // Remove airplane marker when arrived
            const marker = this.airplaneMarkers.get(route.id);
            if (marker) {
              this.map.removeLayer(marker);
              this.airplaneMarkers.delete(route.id);
            }
          } else {
            // Update airplane position
            this.updateAirplanePosition(route);
          }
        }
      });
    }, 200);
  }

  private updateAirplanePosition(route: FlightRoute) {
    const marker = this.airplaneMarkers.get(route.id);
    if (!marker || !route.progress) return;

    const progress = route.progress / 100;
    const lat =
      route.origin.lat + (route.destination.lat - route.origin.lat) * progress;
    const lng =
      route.origin.lng + (route.destination.lng - route.origin.lng) * progress;

    // Calculate the bearing for correct airplane direction
    const bearing = this.calculateBearing(
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng
    );

    // Update marker position
    marker.setLatLng([lat, lng]);

    // Update marker icon with correct rotation
    const airplaneIcon = L.divIcon({
      html: `
        <div style="
          width: 32px; 
          height: 32px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transform: rotate(${bearing}deg);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" 
                  fill="#2563eb" stroke="#1e40af" stroke-width="1"/>
          </svg>
        </div>
      `,
      className: 'airplane-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    marker.setIcon(airplaneIcon);
    marker.setPopupContent(`
      <div style="min-width: 150px;">
        <strong>✈️ Flight ${route.flightNumber}</strong><br>
        <div style="margin: 8px 0;">
          <span style="color: #666;">Progress:</span> 
          <strong style="color: #2563eb;">${route.progress}%</strong>
        </div>
        <div style="margin: 8px 0;">
          <span style="color: #666;">Cargo:</span> 
          <strong style="color: #e67e22;">${route.cargoWeight}</strong>
        </div>
        <div style="margin: 8px 0; font-size: 12px; color: #666;">
          ${route.origin.code} → ${route.destination.code}
        </div>
      </div>
    `);
  }
}
