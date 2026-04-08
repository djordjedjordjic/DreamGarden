import { TestBed } from '@angular/core/testing';

import { PocetnaService } from './pocetna.service';

describe('PocetnaService', () => {
  let service: PocetnaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PocetnaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
