import { TestBed } from '@angular/core/testing';

import { ExamEtudiantService } from './exam-etudiant-service';

describe('ExamEtudiantService', () => {
  let service: ExamEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamEtudiantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
