import { TestBed } from '@angular/core/testing';

import { QuickAccesAdminService } from './quick-acces-admin-service';

describe('QuickAccesAdminService', () => {
  let service: QuickAccesAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickAccesAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
