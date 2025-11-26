import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Faculte } from './faculte';

describe('Faculte', () => {
  let component: Faculte;
  let fixture: ComponentFixture<Faculte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Faculte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Faculte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
