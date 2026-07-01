import { TestBed } from '@angular/core/testing';

import { FormBuilderStateService } from './form-builder';

describe('FormBuilderStateService', () => {
  let service: FormBuilderStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormBuilderStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
