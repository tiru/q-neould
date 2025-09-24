import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../cargo-dashboard/cargo-dashboard').then((m) => m.CargoDashboard),
      },
      {
        path: 'revenue-optimization',
        loadComponent: () =>
          import('../revenue-optimization/revenue-optimization').then((m) => m.RevenueOptimizationTestComponent),
      },
      {
        path: 'delay-monitor',
        loadComponent: () =>
          import('../delay-monitor/delay-monitor').then((m) => m.DelayMonitor),
      },
      {
        path: 'predictive-analysis',
        loadComponent: () =>
          import('../predictive-analysis/predictive-analysis').then((m) => m.PredictiveAnalysis),
      },
      {
        path: 'flight-map',
        loadComponent: () =>
          import('../uld-tracking-map/uld-tracking-map.component').then((m) => m.UldTrackingMapComponent),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
];
