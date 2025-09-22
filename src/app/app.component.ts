import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatBubbleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  
})
export class AppComponent implements OnInit {
  isNavOpen = false;
  currentRoute = '/dashboard';
  
  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Revenue Optimization', route: '/revenue-optimization', icon: '💰' },
    { label: 'Delay Monitor', route: '/delay-monitor', icon: '⏰' },
    { label: 'Predictive Analysis', route: '/predictive-analysis', icon: '📈' },
    { label: 'Real-time Tracking', route: '/flight-map', icon: '🗺️' },
    // { label: 'Real-time Tracking', route: '/real-time-tracking', icon: '📡' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.currentRoute = navEvent.urlAfterRedirects;
      });
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  closeNav() {
    this.isNavOpen = false;
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.closeNav();
  }
}