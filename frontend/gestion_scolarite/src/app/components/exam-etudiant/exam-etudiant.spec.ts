import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamEtudiant } from './exam-etudiant';

describe('ExamEtudiant', () => {
  let component: ExamEtudiant;
  let fixture: ComponentFixture<ExamEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamEtudiant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamEtudiant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
