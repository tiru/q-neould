import { Component } from '@angular/core';
import { AccumulationChartModule, ChartModule } from '@syncfusion/ej2-angular-charts';
import {
  AccumulationLegendService,
  PieSeriesService,
  AccumulationDataLabelService,
  SplineAreaSeriesService,
  CategoryService
} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-revenue-optimization',
  standalone: true,
  imports: [AccumulationChartModule, ChartModule],
  providers: [
    PieSeriesService,
    AccumulationDataLabelService,
    AccumulationLegendService,
    SplineAreaSeriesService,
    CategoryService
  ],
  templateUrl: './revenue-optimization.component.html',
  styleUrl: './revenue-optimization.component.scss',
})
export class RevenueOptimizationComponent {
  requests = 32;
  potentialRevenue = '$1.5M';
  donut = 80;
  avgProfit = '$500';

  donutData = [
    { x: 'Shipped', y: 80, fill: '#3b82f6' },
    { x: 'Remaining', y: 20, fill: '#e5e7eb' },
  ];

  uldRows = [
    {
      type: 'AKE',
      color: '#3b82f6',
      used: 12,
      total: 12,
      status: 'Available: 12',
    },
    {
      type: 'LD3',
      color: '#f59e0b',
      used: 0,
      total: 5,
      status: 'Available: 5',
    },
    { type: 'LD3', color: '#10b981', used: 5, total: 5, status: 'In Use: 5' },
    { type: 'PMC', color: '#ef4444', used: 4, total: 5, status: 'Limited' },
  ];

  primaryXAxis = {
    valueType: 'Category',
    majorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    lineStyle: { width: 0 },
    labelStyle: { size: '10px' },
  };

  primaryYAxis = {
    labelStyle: { size: '10px' },
    majorGridLines: { width: 1, color: '#f3f4f6' },
    majorTickLines: { width: 0 },
    lineStyle: { width: 0 },
    minimum: 0,
    maximum: 100,
  };

  revenueData = [
    { x: '151', y: 30 },
    { x: '200', y: 60 },
    { x: '340', y: 40 },
    { x: '400', y: 70 },
    { x: '500', y: 50 },
  ];
  costData = [
    { x: '151', y: 18 },
    { x: '200', y: 22 },
    { x: '340', y: 38 },
    { x: '400', y: 55 },
    { x: '500', y: 42 },
  ];
}
