import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearMaquinaPage } from './crear-maquina.page';

describe('CrearMaquinaPage', () => {
  let component: CrearMaquinaPage;
  let fixture: ComponentFixture<CrearMaquinaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearMaquinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
