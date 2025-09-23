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
  templateUrl: './uld-forecast-chart.component.html',
  standalone: true,
  imports: [CommonModule, ChartModule],
  providers: [LineSeriesService, DateTimeService, TooltipService],
  styleUrls: ['./uld-forecast-chart.component.scss'],
})
export class UldForecastChartComponent implements OnInit {
  @Input() chartData: any[] = [];
  public selectedPoint: any = null;
  public isMobile = false;
  public isTablet = false;
  public chartHeight = '400px';
  public chartWidth = '100%';

  public primaryXAxis: Object = {
    valueType: 'DateTime',
    title: 'Departure Date',
    labelFormat: 'dd/MM',
    intervalType: 'Days',
    labelStyle: { size: '12px' },
    titleStyle: { size: '14px' },
  };

  public primaryYAxis: Object = {
    title: 'ULD Count',
    minimum: 0,
    interval: 1,
    labelStyle: { size: '12px' },
    titleStyle: { size: '14px' },
  };

  public marker: MarkerSettingsModel = {
    visible: true,
    width: 8,
    height: 8,
    fill: '#007bff',
    border: { width: 2, color: '#ffffff' },
  };

  public tooltip: Object = {
    enable: true,
    format: 'Date: ${point.x}<br/>ULD Count: ${point.y}<br/>Click for details',
    textStyle: { size: '12px' },
  };

  public chartMargin: Object = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
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
      this.chartHeight = '300px';
      this.marker = { ...this.marker, width: 6, height: 6 };
      this.primaryXAxis = {
        ...this.primaryXAxis,
        labelStyle: { size: '10px' },
        titleStyle: { size: '12px' },
      };
      this.primaryYAxis = {
        ...this.primaryYAxis,
        labelStyle: { size: '10px' },
        titleStyle: { size: '12px' },
      };
    } else if (this.isTablet) {
      this.chartHeight = '350px';
      this.marker = { ...this.marker, width: 7, height: 7 };
    } else {
      this.chartHeight = '400px';
      this.marker = { ...this.marker, width: 8, height: 8 };
    }
  }

  private loadChartData(): void {
    // Sample data based on your CSV structure
    this.chartData = [
      {
        depDate: new Date('2025-08-01'),
        uldCount: 12,
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
        depDate: new Date('2025-08-02'),
        uldCount: 3,
        orig: 'DOH',
        dest: 'HYD',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 80,
        wt: 5175.84,
        vol: 33.38,
        pmc: 2,
        qke: 0,
        blk: 0,
        pla: 1,
        pkc: 0,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depDate: new Date('2025-08-03'),
        uldCount: 3,
        orig: 'DOH',
        dest: 'LHR',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 404,
        wt: 2830.2,
        vol: 16.94,
        pmc: 2,
        qke: 0,
        blk: 0,
        pla: 1,
        pkc: 0,
        alf: 0,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depDate: new Date('2025-08-04'),
        uldCount: 15,
        orig: 'DOH',
        dest: 'FRA',
        carEqpTyp: '77D',
        cgoCtgry: 'FREIGHT',
        pcs: 520,
        wt: 8750.3,
        vol: 45.2,
        pmc: 6,
        qke: 3,
        blk: 2,
        pla: 2,
        pkc: 1,
        alf: 1,
        ake: 0,
        paj: 0,
        rap: 0,
      },
      {
        depDate: new Date('2025-08-05'),
        uldCount: 8,
        orig: 'DOH',
        dest: 'CDG',
        carEqpTyp: '35Q',
        cgoCtgry: 'FREIGHT',
        pcs: 280,
        wt: 6420.8,
        vol: 38.7,
        pmc: 4,
        qke: 1,
        blk: 1,
        pla: 2,
        pkc: 0,
        alf: 0,
        ake: 0,
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
