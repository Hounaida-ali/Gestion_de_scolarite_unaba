import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteAdmin } from './actualite-admin';

describe('ActualiteAdmin', () => {
  let component: ActualiteAdmin;
  let fixture: ComponentFixture<ActualiteAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
