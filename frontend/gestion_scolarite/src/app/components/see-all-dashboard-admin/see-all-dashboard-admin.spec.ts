import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllDashboardAdmin } from './see-all-dashboard-admin';

describe('SeeAllDashboardAdmin', () => {
  let component: SeeAllDashboardAdmin;
  let fixture: ComponentFixture<SeeAllDashboardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeAllDashboardAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeAllDashboardAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
