import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationTooltipService,
  AreaSeriesService,
  CategoryService,
  ChartModule,
  LegendService,
  PieSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { CargoShipmentService } from '../service/cargo-shipment.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-revenue-optimization-test',
  standalone: true,
  imports: [CommonModule, AccumulationChartModule, ChartModule, FormsModule, HttpClientModule, LoaderComponent],
  providers: [
    PieSeriesService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    AreaSeriesService,
    CategoryService,
    TooltipService,
    LegendService,
    CargoShipmentService,
  ],
  templateUrl: './revenue-optimization.html',
  styleUrl: './revenue-optimization.scss',
})
export class RevenueOptimizationTestComponent {
  uldSectionExpanded = true;
  analysisSectionExpanded = true;
  selectedUldIndex = -1;
  revenueSeriesVisible = true;
  profitSeriesVisible = true;
  loader = false;
  revenueOptimizationData: any;
  ddlProduct = 'uld-filter';
  products = [
    { label: 'ULD Filter', value: 'uld-filter' },
    { label: 'AKE', value: 'ake' }
  ];
  constructor(public cargoService: CargoShipmentService) {}

  public chartColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  public tooltipSettings = {
    enable: true,
    format: '${point.x}: ${point.y}%',
  };


  public legendSettings = {
    visible: false,
  };

  public primaryXAxis = {
    valueType: 'Category',
    labelStyle: { color: '#94a3b8', size: '10px' },
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
  };

  public primaryYAxis = {
    labelStyle: { color: '#94a3b8', size: '10px' },
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
    majorGridLines: { width: 0 },
  };

  public areaTooltipSettings = {
    enable: true,
    shared: false,
    format: '${series.name}: ${point.y}',
  };

  public areaLegendSettings = {
    visible: false,
  };

  ngOnInit(): void {
    this.loader = true;   
    this.cargoService.getRevenueOptimizationDetail().subscribe((data) => {
      this.revenueOptimizationData = data;
      this.loader = false;
    });
  }

  toggleUldSection(): void {
    this.uldSectionExpanded = !this.uldSectionExpanded;
  }

  toggleAnalysisSection(): void {
    this.analysisSectionExpanded = !this.analysisSectionExpanded;
  }

  selectUld(index: number): void {
    this.selectedUldIndex = this.selectedUldIndex === index ? -1 : index;
  }

  toggleUldTypeFilter(): void {
    console.log('ULD Type Filter clicked');
  }

  toggleUldFilter(): void {
    // Implement filter logic here
    console.log('ULD Filter clicked');
  }

  toggleRevenueSeries(): void {
    this.revenueSeriesVisible = !this.revenueSeriesVisible;
  }

  toggleProfitSeries(): void {
    this.profitSeriesVisible = !this.profitSeriesVisible;
  }
}
