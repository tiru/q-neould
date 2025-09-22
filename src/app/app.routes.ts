import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightMapComponent } from './flight-map/flight-map.component';
import { DashboardLandingComponent } from './dashboard-landing/dashboard-landing.component';
import { RevenueOptimizationTestComponent } from './revenue-optimization/revenue-optimization';
import { DelayMonitor } from './delay-monitor/delay-monitor';
import { PredictiveAnalysis } from './predictive-analysis/predictive-analysis';
import { RealTimeUldTracking } from './real-time-uld-tracking/real-time-uld-tracking';
import { CargoDashboard } from './cargo-dashboard/cargo-dashboard';
import { UldTrackingComponent } from './uldtracking/uldtracking.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: CargoDashboard,
  },
  {
    path: 'revenue-optimization',
    component: RevenueOptimizationTestComponent,
  },
  {
    path: 'delay-monitor',
    component: DelayMonitor,
  },
  {
    path: 'predictive-analysis',
    component: PredictiveAnalysis,
  },
  {
    path: 'flight-map',
    component: FlightMapComponent,
  },
//  {
//     path: 'flight-map',
//     component: UldTrackingComponent,
//   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const appRoutes: Routes = routes;
