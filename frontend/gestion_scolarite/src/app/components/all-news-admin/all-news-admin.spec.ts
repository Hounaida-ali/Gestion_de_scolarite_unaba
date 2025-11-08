import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNewsAdmin } from './all-news-admin';

describe('AllNewsAdmin', () => {
  let component: AllNewsAdmin;
  let fixture: ComponentFixture<AllNewsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllNewsAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNewsAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
