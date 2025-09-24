import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-real-time-uld-tracking',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './real-time-uld-tracking.html',
  styleUrl: './real-time-uld-tracking.scss',
})
export class RealTimeUldTracking {
  public aircraftPosition = 35;
  public animationDuration = '10s';
  public flightProgress = 35;
  public estimatedArrival = '16:45 EST';

  public activeCargo = [
    {
      id: 'ULD-12345',
      route: 'LAX → JFK',
      status: 'in-transit',
      statusLabel: 'In Transit',
      progress: 35,
    },
    {
      id: 'ULD-67890',
      route: 'ORD → MIA',
      status: 'loading',
      statusLabel: 'Loading',
      progress: 15,
    },
    {
      id: 'ULD-54321',
      route: 'DEN → SEA',
      status: 'delivered',
      statusLabel: 'Delivered',
      progress: 100,
    },
  ];

  public recentAlerts = [
    {
      type: 'info',
      icon: 'ℹ️',
      title: 'ULD-12345 Update',
      message: 'Shipment passed checkpoint at 14:32',
      time: '2 min ago',
    },
    {
      type: 'warning',
      icon: '⚠️',
      title: 'Weather Alert',
      message: 'Minor turbulence expected for Flight FLT-789',
      time: '5 min ago',
    },
    {
      type: 'success',
      icon: '✅',
      title: 'Delivery Complete',
      message: 'ULD-54321 successfully delivered to SEA',
      time: '12 min ago',
    },
  ];

  ngOnInit(): void {
    this.startFlightAnimation();
  }

  private startFlightAnimation(): void {
    setInterval(() => {
      if (this.flightProgress < 100) {
        this.flightProgress += 1;
        this.aircraftPosition += 0.7;

        // Update ETA based on progress
        const remainingHours = Math.floor((100 - this.flightProgress) * 0.08);
        const remainingMinutes = Math.floor(
          ((100 - this.flightProgress) * 0.08 - remainingHours) * 60
        );
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + remainingHours);
        currentTime.setMinutes(currentTime.getMinutes() + remainingMinutes);
        this.estimatedArrival = currentTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        });
      } else {
        this.flightProgress = 0;
        this.aircraftPosition = 5;
      }
    }, 200);
  }
}
