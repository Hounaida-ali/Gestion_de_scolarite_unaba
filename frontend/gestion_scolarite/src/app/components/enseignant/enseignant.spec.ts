import { ComponentFixture, TestBed } from '@angular/core/testing';

import { enseignant } from './enseignant';

describe('Enseignant', () => {
  let component: enseignant;
  let fixture: ComponentFixture<enseignant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [enseignant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(enseignant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
