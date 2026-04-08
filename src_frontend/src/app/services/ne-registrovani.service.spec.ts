import { TestBed } from '@angular/core/testing';

import { NeRegistrovaniService } from './ne-registrovani.service';

describe('NeRegistrovaniService', () => {
  let service: NeRegistrovaniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeRegistrovaniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
