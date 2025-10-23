import { TestBed } from '@angular/core/testing';

import { SeeAllDashboardService } from './see-all-dashboard-service';

describe('SeeAllDashboardService', () => {
  let service: SeeAllDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeeAllDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
