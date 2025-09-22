import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveAnalysis } from './predictive-analysis';

describe('PredictiveAnalysis', () => {
  let component: PredictiveAnalysis;
  let fixture: ComponentFixture<PredictiveAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictiveAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictiveAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
