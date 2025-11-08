import { TestBed } from '@angular/core/testing';

import { AllNewsAdminService } from './all-news-admin-service';

describe('AllNewsAdminService', () => {
  let service: AllNewsAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllNewsAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
