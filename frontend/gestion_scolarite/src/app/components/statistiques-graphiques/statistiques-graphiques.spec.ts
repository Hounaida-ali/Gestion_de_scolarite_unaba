import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesGraphiques } from './statistiques-graphiques';

describe('StatistiquesGraphiques', () => {
  let component: StatistiquesGraphiques;
  let fixture: ComponentFixture<StatistiquesGraphiques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiquesGraphiques]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiquesGraphiques);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
