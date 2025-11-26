import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilEnseignent } from './profil-enseignent';

describe('ProfilEnseignent', () => {
  let component: ProfilEnseignent;
  let fixture: ComponentFixture<ProfilEnseignent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilEnseignent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilEnseignent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
