import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listinscription } from './listinscription';

describe('Listinscription', () => {
  let component: Listinscription;
  let fixture: ComponentFixture<Listinscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listinscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listinscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
