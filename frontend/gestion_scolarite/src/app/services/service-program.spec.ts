import { TestBed } from '@angular/core/testing';

import { ServiceProgram } from './service-program';

describe('ServiceProgram', () => {
  let service: ServiceProgram;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProgram);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
