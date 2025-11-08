import { TestBed } from '@angular/core/testing';

import { NotificationScheduleService } from './notification-schedule-service';

describe('NotificationScheduleService', () => {
  let service: NotificationScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
