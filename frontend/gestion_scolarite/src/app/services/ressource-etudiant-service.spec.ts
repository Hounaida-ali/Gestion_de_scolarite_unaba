import { TestBed } from '@angular/core/testing';

import { RessourceEtudiantService } from './ressource-etudiant-service';

describe('RessourceEtudiantService', () => {
  let service: RessourceEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RessourceEtudiantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
