import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueOptimization } from './revenue-optimization';

describe('RevenueOptimization', () => {
  let component: RevenueOptimization;
  let fixture: ComponentFixture<RevenueOptimization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueOptimization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueOptimization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
