import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEnseignant } from './layout-enseignant';

describe('LayoutEnseignant', () => {
  let component: LayoutEnseignant;
  let fixture: ComponentFixture<LayoutEnseignant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutEnseignant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutEnseignant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
