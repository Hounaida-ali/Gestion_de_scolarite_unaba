import { TestBed } from '@angular/core/testing';

import { CalendarEtudiantService } from './calendar-etudiant-service';

describe('CalendarEtudiantService', () => {
  let service: CalendarEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarEtudiantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
