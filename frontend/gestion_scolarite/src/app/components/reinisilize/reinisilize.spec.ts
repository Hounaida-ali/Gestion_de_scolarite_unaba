import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reinisilize } from './reinisilize';

describe('Reinisilize', () => {
  let component: Reinisilize;
  let fixture: ComponentFixture<Reinisilize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reinisilize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reinisilize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
