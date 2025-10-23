import { TestBed } from '@angular/core/testing';

import { DepartementGroupService } from './departement-group-service';

describe('DepartementGroupService', () => {
  let service: DepartementGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartementGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
