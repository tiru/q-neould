import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayMonitor } from './delay-monitor';

describe('DelayMonitor', () => {
  let component: DelayMonitor;
  let fixture: ComponentFixture<DelayMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayMonitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelayMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
