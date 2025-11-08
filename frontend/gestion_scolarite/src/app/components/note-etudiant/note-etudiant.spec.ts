import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteEtudiant } from './note-etudiant';

describe('NoteEtudiant', () => {
  let component: NoteEtudiant;
  let fixture: ComponentFixture<NoteEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEtudiant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteEtudiant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
