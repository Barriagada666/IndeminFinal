import { TestBed } from '@angular/core/testing';

import { ChecklistRealizadoService } from './checklist-realizado.service';

describe('ChecklistRealizadoService', () => {
  let service: ChecklistRealizadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistRealizadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
