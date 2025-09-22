import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartModule,
  ColumnSeriesService,
  CategoryService,
  TooltipService,
  DataLabelService,
  AccumulationChartModule,
  PieSeriesService,
  AccumulationTooltipService,
  AccumulationDataLabelService,
} from '@syncfusion/ej2-angular-charts';
import { HttpClientModule } from '@angular/common/http';
import { CargoShipmentService } from '../service/cargo-shipment.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-predictive-analysis',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    AccumulationChartModule,
    HttpClientModule,
    LoaderComponent,
  ],
  providers: [
    ColumnSeriesService,
    CategoryService,
    TooltipService,
    DataLabelService,
    PieSeriesService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    CargoShipmentService,
  ],
  templateUrl: './predictive-analysis.html',
  styleUrl: './predictive-analysis.scss',
})
export class PredictiveAnalysis {
  predictiveAnalyticsData: any;
  loader = false;
  constructor(public cargoService: CargoShipmentService) {}
  public delayPredictionData = [
    { time: '06:00', potential: 15 },
    { time: '09:00', potential: 35 },
    { time: '12:00', potential: 28 },
    { time: '15:00', potential: 42 },
    { time: '18:00', potential: 31 },
    { time: '21:00', potential: 18 },
  ];

  public riskData = [
    { category: 'Weather', value: 35 },
    { category: 'Traffic', value: 25 },
    { category: 'Operational', value: 25 },
    { category: 'Other', value: 15 },
  ];

  public riskColors = ['#9ca3af', '#6366f1', '#f59e0b', '#10b981'];

  public recommendations = [
    {
      icon: '🔄',
      title: 'Route Optimization',
      description: 'Consider alternate routes for flights FLT-456, FLT-789',
      priority: 'high',
    },
    {
      icon: '📦',
      title: 'ULD Reallocation',
      description: 'Redistribute cargo load to optimize weight distribution',
      priority: 'medium',
    },
    {
      icon: '⚡',
      title: 'Priority Handling',
      description: 'Fast-track high-value shipments through customs',
      priority: 'high',
    },
  ];

  public primaryXAxis = {
    valueType: 'Category',
    labelStyle: { size: '9px' },
  };

  public primaryYAxis = {
    labelStyle: { size: '9px' },
    minimum: 0,
    maximum: 50,
  };

  public tooltipSettings = {
    enable: true,
  };

  public dataLabelSettings = {
    visible: false,
  };

  public markerSettings = {
    visible: false,
  };

  ngOnInit(): void {
    this.loader = true;
    setTimeout(() => {
      this.cargoService.getPredictiveAnalysisDetail().subscribe((data) => {
        this.predictiveAnalyticsData = data;
        this.loader = false;
      });
    }, 1000);
  }
}
