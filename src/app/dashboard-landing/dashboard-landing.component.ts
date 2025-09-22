import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { CommonModule } from '@angular/common';

interface DashboardData {
  totalShipments: number;
  totalShipmentUpDown: string;
  onTimePerformance: number;
  onTimePerformanceUpDown: string;
  revenue: number;
  revenueUpDown: string;
  activeAlerts: number;
  activeAlertsUpDown: string;
}

@Component({
  selector: 'app-dashboard-landing',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './dashboard-landing.component.html',
  styleUrl: './dashboard-landing.component.scss',
})
export class DashboardLandingComponent {
  loader = false;
  dashboardData: DashboardData = {
    totalShipments: 1247,
    totalShipmentUpDown: '12%',
    onTimePerformance: 94.2,
    onTimePerformanceUpDown: '3.1%',
    revenue: 8.7,
    revenueUpDown: '15.3%',
    activeAlerts: 7,
    activeAlertsUpDown: '2'
  };

  ngOnInit(): void {
    // Initialize component logic here
  }

  checkUpTrendClass(value: string): boolean {
    return !value.includes('-');
  }
}
