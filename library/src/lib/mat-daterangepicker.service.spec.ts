import { TestBed } from '@angular/core/testing';

import { MatDaterangepickerService } from './mat-daterangepicker.service';

describe('MatDaterangepickerService', () => {
  let service: MatDaterangepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatDaterangepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
