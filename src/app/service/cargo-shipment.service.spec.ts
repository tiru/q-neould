import { TestBed } from '@angular/core/testing';

import { CargoShipmentService } from './cargo-shipment.service';

describe('NeouldServiceService', () => {
  let service: CargoShipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargoShipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
