import { TestBed } from '@angular/core/testing';

import { NoteEtudiantService } from './note-etudiant-service';

describe('NoteEtudiantService', () => {
  let service: NoteEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteEtudiantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
