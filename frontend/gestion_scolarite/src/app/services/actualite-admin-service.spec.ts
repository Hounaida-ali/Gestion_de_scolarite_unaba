import { TestBed } from '@angular/core/testing';

import { ActualiteAdminService } from './actualite-admin-service';

describe('ActualiteAdminService', () => {
  let service: ActualiteAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualiteAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
