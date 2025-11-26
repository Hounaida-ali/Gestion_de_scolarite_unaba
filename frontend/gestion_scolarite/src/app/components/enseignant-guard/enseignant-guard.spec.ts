import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantGuard } from './enseignant-guard';

describe('EnseignantGuard', () => {
  let component: EnseignantGuard;
  let fixture: ComponentFixture<EnseignantGuard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignantGuard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnseignantGuard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
