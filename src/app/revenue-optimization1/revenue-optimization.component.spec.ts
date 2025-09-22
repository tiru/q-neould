import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueOptimizationComponent } from './revenue-optimization.component';

describe('RevenueOptimizationComponent', () => {
  let component: RevenueOptimizationComponent;
  let fixture: ComponentFixture<RevenueOptimizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueOptimizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RevenueOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
