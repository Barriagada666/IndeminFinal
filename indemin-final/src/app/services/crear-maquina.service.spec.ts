import { TestBed } from '@angular/core/testing';

import { CrearMaquinaService } from './crear-maquina.service';

describe('CrearMaquinaService', () => {
  let service: CrearMaquinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearMaquinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
