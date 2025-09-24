import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface ULDData {
  id: string;
  type: string;
  weight: number;
  capacity: number;
  status: 'loaded' | 'in-transit' | 'unloaded' | 'delayed';
  contents: string[];
  temperature?: number;
  hazmat: boolean;
}

interface TrackingPoint {
  id: string;
  name: string;
  code: string;
  coordinates: { x: number; y: number };
  type: 'source' | 'destination' | 'transit';
  ulds: ULDData[];
  estimatedTime?: string;
  actualTime?: string;
}

interface FlightRoute {
  id: string;
  flightNumber: string;
  aircraft: string;
  points: TrackingPoint[];
  currentPosition: { x: number; y: number };
  progress: number;
  status: 'scheduled' | 'departed' | 'in-flight' | 'arrived' | 'delayed';
}

@Component({
  selector: 'app-uld-tracking',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './uldtracking.component.html',
  styleUrls: ['./uldtracking.component.scss']
})
export class UldTrackingComponent implements OnInit {
  selectedRoute: FlightRoute | null = null;
  selectedPoint: TrackingPoint | null = null;
  selectedULD: ULDData | null = null;
  
  flightRoutes: FlightRoute[] = [
    {
      id: '1',
      flightNumber: 'QR8801',
      aircraft: 'Boeing 777F',
      progress: 65,
      status: 'in-flight',
      currentPosition: { x: 45, y: 35 },
      points: [
        {
          id: 'doh',
          name: 'Hamad International Airport',
          code: 'DOH',
          coordinates: { x: 20, y: 40 },
          type: 'source',
          estimatedTime: '14:30',
          actualTime: '14:25',
          ulds: [
            {
              id: 'AKE-12345',
              type: 'AKE',
              weight: 1200,
              capacity: 1500,
              status: 'loaded',
              contents: ['Electronics', 'Pharmaceuticals'],
              temperature: 18,
              hazmat: false
            },
            {
              id: 'AMA-67890',
              type: 'AMA',
              weight: 2800,
              capacity: 3200,
              status: 'loaded',
              contents: ['Automotive Parts', 'Machinery'],
              hazmat: false
            },
            {
              id: 'AKH-11111',
              type: 'AKH',
              weight: 950,
              capacity: 1100,
              status: 'loaded',
              contents: ['Textiles', 'Consumer Goods'],
              hazmat: false
            }
          ]
        },
        {
          id: 'fra',
          name: 'Frankfurt Airport',
          code: 'FRA',
          coordinates: { x: 80, y: 25 },
          type: 'destination',
          estimatedTime: '19:45',
          ulds: [
            {
              id: 'AKE-12345',
              type: 'AKE',
              weight: 1200,
              capacity: 1500,
              status: 'in-transit',
              contents: ['Electronics', 'Pharmaceuticals'],
              temperature: 18,
              hazmat: false
            },
            {
              id: 'AMA-67890',
              type: 'AMA',
              weight: 2800,
              capacity: 3200,
              status: 'in-transit',
              contents: ['Automotive Parts', 'Machinery'],
              hazmat: false
            },
            {
              id: 'PMC-22222',
              type: 'PMC',
              weight: 1800,
              capacity: 2000,
              status: 'in-transit',
              contents: ['Chemicals', 'Industrial Equipment'],
              hazmat: true
            }
          ]
        }
      ]
    },
    {
      id: '2',
      flightNumber: 'QR8802',
      aircraft: 'Airbus A330F',
      progress: 25,
      status: 'departed',
      currentPosition: { x: 30, y: 60 },
      points: [
        {
          id: 'doh2',
          name: 'Hamad International Airport',
          code: 'DOH',
          coordinates: { x: 20, y: 65 },
          type: 'source',
          estimatedTime: '08:15',
          actualTime: '08:10',
          ulds: [
            {
              id: 'AKE-33333',
              type: 'AKE',
              weight: 1100,
              capacity: 1500,
              status: 'loaded',
              contents: ['Medical Supplies', 'Laboratory Equipment'],
              temperature: 4,
              hazmat: false
            },
            {
              id: 'AMA-44444',
              type: 'AMA',
              weight: 2600,
              capacity: 3200,
              status: 'loaded',
              contents: ['Construction Materials', 'Steel Components'],
              hazmat: false
            }
          ]
        },
        {
          id: 'lhr',
          name: 'London Heathrow',
          code: 'LHR',
          coordinates: { x: 75, y: 70 },
          type: 'destination',
          estimatedTime: '12:30',
          ulds: [
            {
              id: 'AKE-33333',
              type: 'AKE',
              weight: 1100,
              capacity: 1500,
              status: 'in-transit',
              contents: ['Medical Supplies', 'Laboratory Equipment'],
              temperature: 4,
              hazmat: false
            },
            {
              id: 'AMA-44444',
              type: 'AMA',
              weight: 2600,
              capacity: 3200,
              status: 'in-transit',
              contents: ['Construction Materials', 'Steel Components'],
              hazmat: false
            }
          ]
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.selectedRoute = this.flightRoutes[0];
    this.startRealTimeUpdates();
  }

  selectRoute(route: FlightRoute): void {
    this.selectedRoute = route;
    this.selectedPoint = null;
    this.selectedULD = null;
  }

  selectPoint(point: TrackingPoint): void {
    this.selectedPoint = point;
    this.selectedULD = null;
  }

  selectULD(uld: ULDData): void {
    this.selectedULD = uld;
  }

  closePointDetails(): void {
    this.selectedPoint = null;
  }

  closeULDDetails(): void {
    this.selectedULD = null;
  }

  getStatusColor(status: string): string {
    const colors = {
      'loaded': '#10b981',
      'in-transit': '#3b82f6',
      'unloaded': '#6b7280',
      'delayed': '#ef4444',
      'scheduled': '#8b5cf6',
      'departed': '#f59e0b',
      'in-flight': '#3b82f6',
      'arrived': '#10b981'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  }

  getULDTypeIcon(type: string): string {
    const icons = {
      'AKE': '📦',
      'AMA': '🏗️',
      'AKH': '📋',
      'PMC': '⚗️'
    };
    return icons[type as keyof typeof icons] || '📦';
  }

  getCapacityPercentage(uld: ULDData): number {
    return (uld.weight / uld.capacity) * 100;
  }

  private startRealTimeUpdates(): void {
    setInterval(() => {
      this.flightRoutes.forEach(route => {
        if (route.status === 'in-flight') {
          // Simulate aircraft movement
          if (route.progress < 100) {
            route.progress += Math.random() * 2;
            const sourcePoint = route.points.find(p => p.type === 'source')!;
            const destPoint = route.points.find(p => p.type === 'destination')!;
            
            const progressRatio = route.progress / 100;
            route.currentPosition.x = sourcePoint.coordinates.x + 
              (destPoint.coordinates.x - sourcePoint.coordinates.x) * progressRatio;
            route.currentPosition.y = sourcePoint.coordinates.y + 
              (destPoint.coordinates.y - sourcePoint.coordinates.y) * progressRatio;
          }
        }
      });
    }, 3000);
  }
}