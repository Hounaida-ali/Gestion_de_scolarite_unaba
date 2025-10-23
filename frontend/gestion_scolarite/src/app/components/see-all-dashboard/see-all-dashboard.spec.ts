import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllDashboard } from './see-all-dashboard';

describe('SeeAllDashboard', () => {
  let component: SeeAllDashboard;
  let fixture: ComponentFixture<SeeAllDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeAllDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeAllDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
