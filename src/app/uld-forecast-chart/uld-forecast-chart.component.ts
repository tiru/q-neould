import { Component, OnInit, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ChartModule,
  LineSeriesService,
  DateTimeService,
  TooltipService,
  MarkerSettingsModel,
} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-uld-forecast-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [LineSeriesService, DateTimeService, TooltipService],
  templateUrl: './uld-forecast-chart.component.html',
  styleUrls: ['./uld-forecast-chart.component.scss'],
})
export class UldForecastChartComponent implements OnInit {
  public chartData: any[] = [];
  public selectedPoint: any = null;
  public isMobile = false;
  public isTablet = false;
  public chartHeight = '400px';
  public chartWidth = '100%';

  public primaryXAxis: Object = {
    valueType: 'DateTime',
    title: '',
    labelFormat: 'HH:mm',
    intervalType: 'Hours',
    interval: 4,
    labelStyle: {
      size: '11px',
      color: '#666666',
      fontFamily: 'Arial, sans-serif',
    },
    lineStyle: { width: 1, color: '#e0e0e0' },
    majorGridLines: {
      width: 1,
      color: '#f0f0f0',
      dashArray: '0',
    },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
  };

  public primaryYAxis: Object = {
    title: '',
    minimum: 0,
    maximum: 60,
    interval: 20,
    labelStyle: {
      size: '11px',
      color: '#666666',
      fontFamily: 'Arial, sans-serif',
    },
    lineStyle: { width: 1, color: '#e0e0e0' },
    majorGridLines: {
      width: 1,
      color: '#f0f0f0',
      dashArray: '0',
    },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
  };

  public marker: MarkerSettingsModel = {
    visible: true,
    width: 6,
    height: 6,
    fill: '#4CAF50',
    border: { width: 0 },
  };

  public tooltip: Object = {
    enable: true,
    format: 'Time: ${point.x}<br/>ULD Count: ${point.y}<br/>Click for details',
    textStyle: {
      size: '11px',
      fontFamily: 'Arial, sans-serif',
    },
    fill: 'rgba(0, 0, 0, 0.8)',
    border: { width: 0 },
  };

  public chartMargin: Object = {
    left: 40,
    right: 20,
    top: 20,
    bottom: 40,
  };

  public chartArea: Object = {
    border: { width: 0 },
    background: '#ffffff',
  };

  public chartBorder: Object = {
    width: 0,
  };

  public uldTypes = [
    { key: 'pmc', label: 'PMC' },
    { key: 'qke', label: 'QKE' },
    { key: 'blk', label: 'BLK' },
    { key: 'pla', label: 'PLA' },
    { key: 'pkc', label: 'PKC' },
    { key: 'alf', label: 'ALF' },
    { key: 'ake', label: 'AKE' },
    { key: 'paj', label: 'PAJ' },
    { key: 'rap', label: 'RAP' },
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
    this.updateChartDimensions();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateChartDimensions();
    this.loadChartData();
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
    this.isTablet = width > 768 && width <= 1024;
  }

  private updateChartDimensions(): void {
    if (this.isMobile) {
      this.chartHeight = '280px';
      this.marker = { ...this.marker, width: 5, height: 5 };
      this.primaryXAxis = {
        ...this.primaryXAxis,
        labelStyle: {
          size: '10px',
          color: '#666666',
          fontFamily: 'Arial, sans-serif',
        },
      };
      this.primaryYAxis = {
        ...this.primaryYAxis,
        labelStyle: {
          size: '10px',
          color: '#666666',
          fontFamily: 'Arial, sans-serif',
        },
      };
    } else if (this.isTablet) {
      this.chartHeight = '320px';
      this.marker = { ...this.marker, width: 6, height: 6 };
    } else {
      this.chartHeight = '360px';
      this.marker = { ...this.marker, width: 6, height: 6 };
    }
  }

  private loadChartData(): void {
    // Sample data with hourly time intervals to match the attached chart
    const baseDate = new Date('2025-08-01');

    this.chartData = [
      {
        depTime: new Date(baseDate.getTime() + 0 * 60 * 60 * 1000), // 00:00
        uldCount: 45,
        orig: 'DOH',
        dest: 'AMS',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 366,
        wt: 11428.59,
        vol: 62.456,
        pmc: 8,
        qke: 2,
        blk: 1,
        pla: 1,
        pkc: 0,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depTime: new Date(baseDate.getTime() + 4 * 60 * 60 * 1000), // 04:00
        uldCount: 52,
        orig: 'DOH',
        dest: 'HYD',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 380,
        wt: 5175.84,
        vol: 33.38,
        pmc: 12,
        qke: 3,
        blk: 2,
        pla: 1,
        pkc: 1,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depTime: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000), // 08:00
        uldCount: 38,
        orig: 'DOH',
        dest: 'LHR',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 404,
        wt: 2830.2,
        vol: 16.94,
        pmc: 7,
        qke: 1,
        blk: 0,
        pla: 2,
        pkc: 0,
        alf: 1,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depTime: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000), // 12:00
        uldCount: 42,
        orig: 'DOH',
        dest: 'FRA',
        carEqpTyp: '77D',
        cgoCtgry: 'FREIGHT',
        pcs: 520,
        wt: 8750.3,
        vol: 45.2,
        pmc: 9,
        qke: 2,
        blk: 1,
        pla: 3,
        pkc: 0,
        alf: 0,
        ake: 1,
        paj: 0,
        rap: 0,
      },
      {
        depTime: new Date(baseDate.getTime() + 16 * 60 * 60 * 1000), // 16:00
        uldCount: 35,
        orig: 'DOH',
        dest: 'CDG',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 280,
        wt: 6420.8,
        vol: 38.7,
        pmc: 6,
        qke: 1,
        blk: 0,
        pla: 2,
        pkc: 1,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depTime: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000), // 20:00
        uldCount: 40,
        orig: 'DOH',
        dest: 'JFK',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 450,
        wt: 7890.5,
        vol: 42.1,
        pmc: 8,
        qke: 2,
        blk: 1,
        pla: 2,
        pkc: 0,
        alf: 1,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depTime: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000), // 24:00 (next day 00:00)
        uldCount: 48,
        orig: 'DOH',
        dest: 'NRT',
        carEqpTyp: '77D',
        cgoCtgry: 'FREIGHT',
        pcs: 380,
        wt: 9200.3,
        vol: 51.2,
        pmc: 10,
        qke: 3,
        blk: 2,
        pla: 1,
        pkc: 1,
        alf: 0,
        ake: 1,
        paj: 0,
        rap: 0,
      },
    ];
  }

  onPointClick(event: any): void {
    const clickedIndex = event.pointIndex;
    this.selectedPoint = { ...this.chartData[clickedIndex] };
  }

  closeDetails(): void {
    this.selectedPoint = null;
  }
}
