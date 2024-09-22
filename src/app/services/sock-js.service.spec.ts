import { TestBed } from '@angular/core/testing';

import { SockJsService } from './sock-js.service';

describe('SockJsService', () => {
  let service: SockJsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SockJsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
