import { TestBed } from '@angular/core/testing';

import { DekoraterService } from './dekorater.service';

describe('DekoraterService', () => {
  let service: DekoraterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DekoraterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
