import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeUldTracking } from './real-time-uld-tracking';

describe('RealTimeUldTracking', () => {
  let component: RealTimeUldTracking;
  let fixture: ComponentFixture<RealTimeUldTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTimeUldTracking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimeUldTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
