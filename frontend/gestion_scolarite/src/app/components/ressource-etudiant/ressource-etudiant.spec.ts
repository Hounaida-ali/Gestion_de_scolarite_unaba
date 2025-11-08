import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourceEtudiant } from './ressource-etudiant';

describe('RessourceEtudiant', () => {
  let component: RessourceEtudiant;
  let fixture: ComponentFixture<RessourceEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RessourceEtudiant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RessourceEtudiant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
