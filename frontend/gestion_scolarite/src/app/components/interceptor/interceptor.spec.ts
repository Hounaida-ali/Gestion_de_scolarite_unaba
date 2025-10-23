import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interceptor } from './interceptor';

describe('Interceptor', () => {
  let component: Interceptor;
  let fixture: ComponentFixture<Interceptor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interceptor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Interceptor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
