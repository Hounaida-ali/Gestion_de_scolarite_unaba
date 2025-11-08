import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccesAdmin } from './quick-acces-admin';

describe('QuickAccesAdmin', () => {
  let component: QuickAccesAdmin;
  let fixture: ComponentFixture<QuickAccesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAccesAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAccesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
