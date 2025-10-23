import { TestBed } from '@angular/core/testing';

import { TelechargementService } from './telechargement-service';

describe('TelechargementService', () => {
  let service: TelechargementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelechargementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
