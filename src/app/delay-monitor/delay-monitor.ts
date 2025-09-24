import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartModule,
  LineSeriesService,
  CategoryService,
  TooltipService,
  DataLabelService,
  AccumulationChartModule,
  PieSeriesService,
  AccumulationTooltipService,
} from '@syncfusion/ej2-angular-charts';
import { CargoShipmentService } from '../service/cargo-shipment.service';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-delay-monitor',
  imports: [
    CommonModule,
    ChartModule,
    AccumulationChartModule,
    HttpClientModule,
    LoaderComponent,
  ],
  providers: [
    LineSeriesService,
    CategoryService,
    TooltipService,
    DataLabelService,
    PieSeriesService,
    AccumulationTooltipService,
    CargoShipmentService,
  ],
  standalone: true,
  templateUrl: './delay-monitor.html',
  styleUrl: './delay-monitor.scss',
})
export class DelayMonitor {
  public activeTab = 'overview';
  cargoDelayData: any;
  loader = false;
  constructor(public cargoService: CargoShipmentService) {}

  public tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'flights', label: 'Flights' },
    { id: 'analysis', label: 'Analysis' },
  ];

  public primaryXAxis = {
    valueType: 'Category',
    labelStyle: { size: '10px' },
  };

  public primaryYAxis = {
    labelStyle: { size: '10px' },
  };

  public tooltipSettings = {
    enable: true,
  };

  public dataLabelSettings = {
    visible: true,
    position: 'Outside',
    name: 'reason',
    font: { size: '10px' },
  };

  public analysisColors = [
    '#9ca3af',
    '#6366f1',
    '#f59e0b',
    '#10b981',
    '#ef4444',
  ];

  ngOnInit(): void {
    this.loader = true;
      this.cargoService.getCargoDelayMonitorDetail().subscribe((data) => {
        this.cargoDelayData = data;
        this.loader = false;
      });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
}
