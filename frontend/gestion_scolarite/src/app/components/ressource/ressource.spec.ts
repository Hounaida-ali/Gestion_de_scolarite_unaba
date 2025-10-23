import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ressource } from './ressource';

describe('Ressource', () => {
  let component: Ressource;
  let fixture: ComponentFixture<Ressource>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ressource]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ressource);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
