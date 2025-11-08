import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleEtudiant } from './schedule-etudiant';

describe('ScheduleEtudiant', () => {
  let component: ScheduleEtudiant;
  let fixture: ComponentFixture<ScheduleEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleEtudiant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleEtudiant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
