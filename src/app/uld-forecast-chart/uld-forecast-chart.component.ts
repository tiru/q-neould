import {
  Component,
  OnInit,
  HostListener,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChartComponent,
  ChartModule,
  LineSeriesService,
  DateTimeService,
  TooltipService,
  MarkerSettingsModel,
  ZoomService,
  DataLabelService,
  CrosshairService,
} from '@syncfusion/ej2-angular-charts';
import { IonAlert } from "@ionic/angular/standalone";

interface UldData {
  depDate: Date;
  uldCount: number;
  forecastUldCount: number; // New property for forecast data
  orig: string;
  numberOfFlights: number;
  pcs: number;
  wt: number;
  vol: number;
  pmc: number;
  qke: number;
  blk: number;
  pla: number;
  pkc: number;
  alf: number;
  ake: number;
  paj: number;
  rap: number;
}

@Component({
  selector: 'app-uld-forecast-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, FormsModule, IonAlert],
  providers: [
    LineSeriesService,
    DateTimeService,
    TooltipService,
    ZoomService,
    DataLabelService,
    CrosshairService,
  ],
  templateUrl: './uld-forecast-chart.component.html',
  styleUrls: ['./uld-forecast-chart.component.scss'],
})
export class UldForecastChartComponent implements OnInit {
  @Input() chartData: UldData[] = [];
  @ViewChild('chart') chart!: ChartComponent;
  @Output() childEvent = new EventEmitter<string>();
  
  isAlertOpen = false;
  alertButtons = ['Close'];
  public selectedPoint: any = null;
  public filteredData: UldData[] = [];
  public isMobile = false;
  public isTablet = false;
  public chartHeight = '450px';
  public chartWidth = '100%';
  public dateForFilter : any = [];

  // Filter properties
  public selectedDateRange = 'all';
  public dateRangeForSelect: string[] = [];
  public selectedOrigin = 'DOH';
  public customStartDate = '';
  public customEndDate = '';
  public availableOrigins: string[] = [];
  public totalUlds = 0;
  public totalForecastUlds = 0; // New property for forecast totals

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  sendMessageToParent() {
    this.childEvent.emit(this.dateForFilter);
  }

  public primaryXAxis: Object = {
    valueType: 'DateTime',
    title: 'Departure Date',
    labelFormat: 'MMM dd',
    intervalType: 'Auto',
    labelStyle: {
      size: '11px',
      color: '#64748b',
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: '500',
    },
    lineStyle: { width: 1, color: '#e2e8f0' },
    majorGridLines: { width: 1, color: '#f1f5f9', dashArray: '2,2' },
    majorTickLines: { width: 1, color: '#cbd5e1' },
    minorTickLines: { width: 0 },
  };

  public primaryYAxis: Object = {
    // title: 'ULD Count',
    minimum: 0,
    labelStyle: {
      size: '11px',
      color: '#64748b',
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: '500',
    },
    lineStyle: { width: 1, color: '#e2e8f0' },
    majorGridLines: { width: 1, color: '#f1f5f9', dashArray: '2,2' },
    majorTickLines: { width: 1, color: '#cbd5e1' },
    minorTickLines: { width: 0 },
  };

  public actualMarker: MarkerSettingsModel = {
    visible: true,
    width: 8,
    height: 8,
    fill: '#d79cb9',
    border: { width: 2, color: '#ffffff' },
    shape: 'Circle',
  };

  public forecastMarker: MarkerSettingsModel = {
    visible: true,
    width: 8,
    height: 8,
    fill: '#A0153E',
    border: { width: 2, color: '#ffffff' },
    shape: 'Triangle',
  };

  public tooltip: Object = {
    enable: true,
    format: '<b>${point.x}</b><br/>${series.name}: <b>${point.y}</b><br/><i>Click for details</i>',
    textStyle: {
      size: '12px',
      color: '#ffffff',
    },
    fill: '#1e293b',
    border: { width: 0 },
    opacity: 0.9,
  };

  public crosshair: Object = {
    enable: true,
    lineType: 'Vertical',
    line: { width: 1, color: '#64748b', dashArray: '5,5' },
  };

  public zoomSettings: Object = {
    enableMouseWheelZooming: true,
    enablePinchZooming: true,
    enableSelectionZooming: true,
    mode: 'X',
  };

  public animation: Object = {
    enable: true,
    duration: 1500,
    delay: 0,
  };

  public chartMargin: Object = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20,
  };

  public chartArea: Object = {
    border: { width: 0, color: "#64043C", fill: "#64043C" },
    background: '#ffffff',
  };

  public chartBorder: Object = {
    width: 0,
  };

  public legendSettings: Object = {
    visible: true,
    position: 'Top',
    textStyle: {
      size: '12px',
      color: '#64043C',
      fontWeight: '600'
    }
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
    this.processData();
    this.initializeFilters();
    this.applyFilters();
    this.sendMessageToParent();
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
    this.isTablet = width > 768 && width <= 1024;
  }

  private updateChartDimensions(): void {
    if (this.isMobile) {
      this.chartHeight = '320px';
      this.actualMarker = { ...this.actualMarker, width: 6, height: 6 };
      this.forecastMarker = { ...this.forecastMarker, width: 6, height: 6 };
      this.chartMargin = { left: 10, right: 10, top: 10, bottom: 10 };
    } else if (this.isTablet) {
      this.chartHeight = '380px';
      this.chartMargin = { left: 50, right: 25, top: 25, bottom: 55 };
    } else {
      this.chartHeight = '450px';
      this.chartMargin = { left: 60, right: 30, top: 30, bottom: 60 };
    }
  }

  private generateForecastData(data: UldData[]): UldData[] {
    return data.map(item => ({
      ...item,
      // Generate forecast data with some variance (10-20% higher/lower)
      forecastUldCount: Math.floor(item.uldCount * (1 + Math.random() * 0.3))
    }));
  }

  private processData(): void {
    // Add forecast data to existing chart data
    this.chartData = this.generateForecastData(this.chartData);
  }

  private initializeFilters(): void {
    // Extract unique origins
    this.availableOrigins = [
      ...new Set(this.chartData.map((item) => item.orig)),
    ].sort();
  }

  public applyFilters(dateRange?: any): void {
    let filtered = [...this.chartData];

    // Apply origin filter
    if (this.selectedOrigin !== 'all') {
      filtered = filtered.filter((item) => item.orig === this.selectedOrigin);
      if(dateRange) {
        filtered = filtered.filter((item) => item.depDate === dateRange);
      }
    }
    
    this.filteredData = filtered;

    if(this.filteredData.length == 0){
      this.setOpen(true);
      this.processData();
    }

    // Calculate totals for both actual and forecast
    this.totalUlds = this.filteredData.reduce((sum, item) => sum + item.uldCount, 0);
    this.totalForecastUlds = this.filteredData.reduce((sum, item) => sum + item.forecastUldCount, 0);

    let filterForDate = filtered;
    filterForDate.forEach((dateFilter) => {
      let dateText = dateFilter.depDate.toLocaleString('default', { month: 'short', day: 'numeric' });
      this.dateForFilter.push(dateText);
    });

    // Update chart axis based on filtered data
    this.updateChartAxis();
  }

  private updateChartAxis(): void {
    if (this.filteredData.length > 0) {
      let interval = 1;
      let labelFormat = 'MMM dd';

      this.primaryXAxis = {
        ...this.primaryXAxis,
        interval,
        labelFormat,
        intervalType: 'Days',
      };
    }
  }

  onPointClick(event: any): void {
    const clickedIndex = event.pointIndex;
    this.selectedPoint = { ...this.filteredData[clickedIndex] };
  }

  closeDetails(): void {
    this.selectedPoint = null;
  }

  getDateRange(): string {
    if (this.filteredData.length === 0) return 'No data';
    const minDate = this.filteredData[0].depDate;
    const maxDate = this.filteredData[this.filteredData.length - 1].depDate;
    return `${minDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${maxDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;
  }
}
