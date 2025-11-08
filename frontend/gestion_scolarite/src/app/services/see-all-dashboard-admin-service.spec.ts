import { TestBed } from '@angular/core/testing';

import { SeeAllDashboardAdminService } from './see-all-dashboard-admin-service';

describe('SeeAllDashboardAdminService', () => {
  let service: SeeAllDashboardAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeeAllDashboardAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
