import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoDashboard } from './cargo-dashboard';

describe('CargoDashboard', () => {
  let component: CargoDashboard;
  let fixture: ComponentFixture<CargoDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
