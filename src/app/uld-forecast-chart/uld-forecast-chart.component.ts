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
    title: 'ULD Count',
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

  public marker: MarkerSettingsModel = {
    visible: true,
    width: 8,
    height: 8,
    fill: '#3b82f6',
    border: { width: 2, color: '#ffffff' },
    shape: 'Circle',
  };

  public tooltip: Object = {
    enable: true,
    format:
      '<b>${point.x}</b><br/>ULDs: <b>${point.y}</b><br/><i>Click for details</i>',
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
    border: { width: 0 },
    background: '#ffffff',
  };

  public chartBorder: Object = {
    width: 0,
  };

  public legendSettings: Object = {
    visible: false,
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
      this.marker = { ...this.marker, width: 6, height: 6 };
      this.chartMargin = { left: 10, right: 10, top: 10, bottom: 10 };
    } else if (this.isTablet) {
      this.chartHeight = '380px';
      this.chartMargin = { left: 50, right: 25, top: 25, bottom: 55 };
    } else {
      this.chartHeight = '450px';
      this.chartMargin = { left: 60, right: 30, top: 30, bottom: 60 };
    }
  }

  private generateExtendedData(): UldData[] {
    const extendedData: UldData[] = [];
    const origins =[
      ...new Set(this.chartData.map((item) => item.orig)),
    ].sort();

    // Generate data for August and September 2025
    const startDate = new Date(); // August 1st
    // Get the current date
    const currentDate = new Date();
    // Create a new Date object to avoid modifying the original
    const futureDate = new Date(currentDate);
    // Number of days to add
    const daysToAdd = 7;
    // Add the days
    futureDate.setDate(futureDate.getDate() + daysToAdd);
    const endDate = futureDate; // September 30th

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      origins.forEach((origin) => {
        // Random chance for each origin to have data on each day
        if (Math.random() > 0.3) {
          const numberOfFlights = Math.floor(Math.random() * 300) + 1;
          const baseUld = Math.floor(Math.random() * 2500) + 50;

          extendedData.push({
            depDate: new Date(d),
            orig: origin,
            numberOfFlights,
            uldCount: baseUld,
            pcs: Math.floor(Math.random() * 100000) + 1000,
            wt: Math.floor(Math.random() * 4000000) + 10000,
            vol: Math.floor(Math.random() * 20000) + 100,
            pmc: Math.floor(baseUld * 0.6) + Math.floor(Math.random() * 200),
            qke: Math.floor(baseUld * 0.2) + Math.floor(Math.random() * 100),
            blk: Math.floor(Math.random() * 10),
            pla: Math.floor(Math.random() * 200),
            pkc: Math.floor(Math.random() * 20),
            alf: Math.floor(Math.random() * 10),
            ake: Math.floor(Math.random() * 30),
            paj: Math.floor(Math.random() * 40),
            rap: Math.floor(Math.random() * 20),
          });
        }
      });
    }

    return extendedData.sort(
      (a, b) => a.depDate.getTime() - b.depDate.getTime()
    );
  }

  private processData(): void {
    // Use extended generated data instead of limited sample
    console.log("before" + this.chartData.length);
    this.chartData; //= this.generateExtendedData();
     console.log("after" + this.chartData.length);
  }

  private initializeFilters(): void {
    // Extract unique origins
    this.availableOrigins = [
      ...new Set(this.chartData.map((item) => item.orig)),
    ].sort();

    console.log("iorigins" + this.availableOrigins);

  }

  public applyFilters(dateRange? :any): void {
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

    this.totalUlds = this.filteredData.reduce(
      (sum, item) => sum + item.uldCount,
      0
    );

    let filterForDate = filtered;
    filterForDate.forEach((dateFilter) => {
      let dateText = dateFilter.depDate.toLocaleString('default', { month: 'short', day: 'numeric' });
      this.dateForFilter.push(dateText);
    });

    console.log("dateReange select" + this.dateForFilter);

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
