import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationEtudiant } from './formation-etudiant';

describe('FormationEtudiant', () => {
  let component: FormationEtudiant;
  let fixture: ComponentFixture<FormationEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationEtudiant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationEtudiant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
