import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEtudiant } from './calendar-etudiant';

describe('CalendarEtudiant', () => {
  let component: CalendarEtudiant;
  let fixture: ComponentFixture<CalendarEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEtudiant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarEtudiant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
