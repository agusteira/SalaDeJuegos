import { TestBed } from '@angular/core/testing';

import { MayorMenorApiService } from './mayor-menor-api.service';

describe('MayorMenorApiService', () => {
  let service: MayorMenorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorMenorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
