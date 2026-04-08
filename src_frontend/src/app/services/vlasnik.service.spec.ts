import { TestBed } from '@angular/core/testing';

import { VlasnikService } from './vlasnik.service';

describe('VlasnikService', () => {
  let service: VlasnikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VlasnikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
