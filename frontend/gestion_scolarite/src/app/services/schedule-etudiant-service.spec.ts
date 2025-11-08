import { TestBed } from '@angular/core/testing';

import { ScheduleEtudiantService } from './schedule-etudiant-service';

describe('ScheduleEtudiantService', () => {
  let service: ScheduleEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleEtudiantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
