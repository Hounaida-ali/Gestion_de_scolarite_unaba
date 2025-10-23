import { TestBed } from '@angular/core/testing';

import { ServiceFormation } from './service-formation';

describe('ServiceFormationTs', () => {
  let service: ServiceFormation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFormation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
