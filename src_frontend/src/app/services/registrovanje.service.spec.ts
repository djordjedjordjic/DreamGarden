import { TestBed } from '@angular/core/testing';

import { RegistrovanjeService } from './registrovanje.service';

describe('RegistrovanjeService', () => {
  let service: RegistrovanjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrovanjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
