import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueOptimizationComponent } from '../revenue-optimization1/revenue-optimization.component';
import { DelayMonitor } from '../delay-monitor/delay-monitor';
import { PredictiveAnalysis } from '../predictive-analysis/predictive-analysis';
import { RealTimeUldTracking } from '../real-time-uld-tracking/real-time-uld-tracking';
import { RevenueOptimizationTestComponent } from '../revenue-optimization/revenue-optimization';
import { CargoShipmentService } from '../service/cargo-shipment.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { FlightMapComponent } from '../flight-map/flight-map.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cargo-dashboard',
  imports: [
    CommonModule,
  
    LoaderComponent,
    HttpClientModule
  ],
  providers: [CargoShipmentService],
  standalone: true,
  templateUrl: './cargo-dashboard.html',
  styleUrl: './cargo-dashboard.scss',
})
export class CargoDashboard implements OnInit {
  public currentTime = new Date();
  public dashboardData: any;
  public loader = false;

  constructor(
    public cargoService: CargoShipmentService
  ) {}

  ngOnInit(): void {
    this.updateCurrentTime();
    setInterval(() => {
      this.updateCurrentTime();
      this.updateStats();
    }, 30000);
    this.getDashboardData();
  }

  checkUpTrendClass(data: any): boolean {
    return data?.includes('+');
  }

  onCardClick(cardType: string): void {
    console.log(`${cardType} card clicked!`);
    
    // Add your navigation or action logic here
    switch(cardType) {
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
    setTimeout(() => {
    this.cargoService.getDashboardDetail().subscribe((data) => {
      console.log('data', data);
      this.dashboardData = data;
      this.loader = false;
    });
  }, 1000);
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
}