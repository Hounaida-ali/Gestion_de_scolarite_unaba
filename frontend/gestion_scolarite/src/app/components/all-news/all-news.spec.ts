import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNews } from './all-news';

describe('AllNews', () => {
  let component: AllNews;
  let fixture: ComponentFixture<AllNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
