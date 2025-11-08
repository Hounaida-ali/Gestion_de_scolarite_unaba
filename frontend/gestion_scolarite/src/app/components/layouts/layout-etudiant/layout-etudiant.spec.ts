import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEtudiant } from './layout-etudiant';

describe('LayoutEtudiant', () => {
  let component: LayoutEtudiant;
  let fixture: ComponentFixture<LayoutEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutEtudiant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutEtudiant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
