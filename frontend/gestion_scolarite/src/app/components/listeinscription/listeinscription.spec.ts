import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listeinscription } from './listeinscription';

describe('Listeinscription', () => {
  let component: Listeinscription;
  let fixture: ComponentFixture<Listeinscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listeinscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listeinscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
