import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEnseignant } from './dashboard-enseignant';

describe('DashboardEnseignant', () => {
  let component: DashboardEnseignant;
  let fixture: ComponentFixture<DashboardEnseignant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEnseignant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEnseignant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
