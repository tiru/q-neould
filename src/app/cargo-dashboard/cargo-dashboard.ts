import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartModule,
  LineSeriesService,
  CategoryService,
  DataLabelService,
  TooltipService,
  LegendService,
  SplineSeriesService,
  AreaSeriesService,
  ColumnSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { HttpClientModule } from '@angular/common/http';
import { CargoShipmentService } from '../service/cargo-shipment.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UldForecastChartComponent } from '../uld-forecast-chart/uld-forecast-chart.component';

@Component({
  selector: 'app-cargo-dashboard',
  // imports: [CommonModule, LoaderComponent, HttpClientModule],
  imports: [
    CommonModule,
    ChartModule,
    HttpClientModule,
    LoaderComponent,
    UldForecastChartComponent,
  ],
  providers: [
    LineSeriesService,
    CategoryService,
    DataLabelService,
    TooltipService,
    LegendService,
    SplineSeriesService,
    AreaSeriesService,
    ColumnSeriesService,
    CargoShipmentService,
  ],
  standalone: true,
  templateUrl: './cargo-dashboard.html',
  styleUrl: './cargo-dashboard.scss',
})
export class CargoDashboard implements OnInit {
  public currentTime = new Date();
  public dashboardData: any;
  public loader = false;
  public forecastChartData: any[] = [];

  constructor(public cargoService: CargoShipmentService) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    setInterval(() => {
      this.updateCurrentTime();
      this.updateStats();
    }, 30000);
    this.getDashboardData();
    this.getChartData();
  }

  checkUpTrendClass(data: any): boolean {
    return data?.includes('+');
  }

  onCardClick(cardType: string): void {
    console.log(`${cardType} card clicked!`);

    // Add your navigation or action logic here
    switch (cardType) {
      case 'shipments':
        // Navigate to shipments page or open modal
        console.log('Opening shipments dashboard...');
        break;
      case 'performance':
        // Navigate to performance analytics
        console.log('Opening performance analytics...');
        break;
      case 'revenue':
        // Navigate to revenue reports
        console.log('Opening revenue reports...');
        break;
      case 'alerts':
        // Navigate to alerts management
        console.log('Opening alerts management...');
        break;
      default:
        console.log('Unknown card type:', cardType);
    }
  }

  private getDashboardData(): void {
    this.loader = true;
    // setTimeout(() => {
      this.cargoService.getDashboardDetail().subscribe((data) => {
        console.log('data', data);
        this.dashboardData = data;
        this.loader = false;
      });
    // }, 1000);
  }

  private getChartData(): void {
    this.cargoService.getForeCastChartData().subscribe((data) => {
      console.log('data', data);
      this.forecastChartData = data;
      this.loader = false;
    });
  }

  private updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  private updateStats(): void {
    if (this.dashboardData) {
      this.dashboardData.totalShipments += Math.floor(Math.random() * 3) - 1;
      this.dashboardData.activeAlerts = Math.max(
        0,
        this.dashboardData.activeAlerts + Math.floor(Math.random() * 3) - 1
      );
    }
  }
  selectedDay: number = 1;
  isDrawerOpen: boolean = false;

  // Chart Data for different days
  chartData: { [key: number]: any[] } = {
    1: [
      { day: 'D1', count: 142 },
      { day: 'D2', count: 138 },
      { day: 'D3', count: 145 },
      { day: 'D4', count: 140 },
      { day: 'D5', count: 143 },
      { day: 'D6', count: 139 },
      { day: 'D7', count: 147 },
    ],
    2: [
      { day: 'D1', count: 138 },
      { day: 'D2', count: 142 },
      { day: 'D3', count: 140 },
      { day: 'D4', count: 145 },
      { day: 'D5', count: 139 },
      { day: 'D6', count: 144 },
      { day: 'D7', count: 141 },
    ],
    3: [
      { day: 'D1', count: 145 },
      { day: 'D2', count: 140 },
      { day: 'D3', count: 148 },
      { day: 'D4', count: 142 },
      { day: 'D5', count: 146 },
      { day: 'D6', count: 141 },
      { day: 'D7', count: 149 },
    ],
    4: [
      { day: 'D1', count: 140 },
      { day: 'D2', count: 144 },
      { day: 'D3', count: 141 },
      { day: 'D4', count: 147 },
      { day: 'D5', count: 143 },
      { day: 'D6', count: 145 },
      { day: 'D7', count: 142 },
    ],
    5: [
      { day: 'D1', count: 143 },
      { day: 'D2', count: 139 },
      { day: 'D3', count: 146 },
      { day: 'D4', count: 141 },
      { day: 'D5', count: 148 },
      { day: 'D6', count: 140 },
      { day: 'D7', count: 144 },
    ],
    6: [
      { day: 'D1', count: 139 },
      { day: 'D2', count: 143 },
      { day: 'D3', count: 140 },
      { day: 'D4', count: 146 },
      { day: 'D5', count: 142 },
      { day: 'D6', count: 147 },
      { day: 'D7', count: 141 },
    ],
    7: [
      { day: 'D1', count: 147 },
      { day: 'D2', count: 141 },
      { day: 'D3', count: 149 },
      { day: 'D4', count: 143 },
      { day: 'D5', count: 145 },
      { day: 'D6', count: 142 },
      { day: 'D7', count: 150 },
    ],
  };

  get predictionData() {
    return this.chartData[this.selectedDay];
  }

  performanceData = [
    { station: 'LHR', efficiency: 94 },
    { station: 'NYC', efficiency: 88 },
    { station: 'DXB', efficiency: 92 },
    { station: 'SIN', efficiency: 96 },
    { station: 'NRT', efficiency: 89 },
  ];

  // Status Data
  uldStatus = {
    available: 142,
    inRepair: 28,
    inTransit: 85,
    critical: 12,
  };

  networkStats = {
    totalUlds: 1247,
    activeStations: 5,
    inTransit: 89,
  };

  tempAlert = {
    message:
      'LHR station: Perishable ULD temperature dropped to 2°C - Immediate attention required',
  };

  // Chart Configuration
  primaryXAxis = {
    valueType: 'Category',
    title: 'Days',
    labelStyle: { color: '#6b7280', size: '12px' },
    titleStyle: { color: '#374151', size: '14px' },
    majorGridLines: { width: 0 },
    lineStyle: { width: 1, color: '#e5e7eb' },
  };

  primaryYAxis = {
    title: 'ULD Count',
    minimum: 130,
    maximum: 155,
    labelStyle: { color: '#6b7280', size: '12px' },
    titleStyle: { color: '#374151', size: '14px' },
    majorGridLines: { width: 1, color: '#f3f4f6' },
    lineStyle: { width: 0 },
  };

  performancePrimaryXAxis = {
    valueType: 'Category',
    title: 'Stations',
    labelStyle: { color: '#6b7280', size: '11px' },
    majorGridLines: { width: 0 },
  };

  performancePrimaryYAxis = {
    title: 'Efficiency %',
    minimum: 80,
    maximum: 100,
    labelStyle: { color: '#6b7280', size: '11px' },
    majorGridLines: { width: 1, color: '#f3f4f6' },
  };

  tooltip = {
    enable: true,
    shared: false,
    format: '${point.x}: ${point.y} ULDs',
  };

  marker = {
    visible: true,
    height: 8,
    width: 8,
    fill: '#667eea',
    border: { width: 2, color: '#ffffff' },
  };

  chartTitle = '';

  selectDay(day: number): void {
    this.selectedDay = day;
  }

  openDetailsDrawer(): void {
    this.isDrawerOpen = true;
  }

  closeDetailsDrawer(): void {
    this.isDrawerOpen = false;
  }

  openRepairDrawer(): void {
    // Implementation for repair drawer
    console.log('Opening repair drawer');
  }
}
