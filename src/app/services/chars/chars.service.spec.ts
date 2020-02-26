import { TestBed, inject } from '@angular/core/testing';

import { CharsService } from './chars.service';

describe('CharsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CharsService]
    });
  });

  it('should be created', inject([CharsService], (service: CharsService) => {
    expect(service).toBeTruthy();
  }));
});
