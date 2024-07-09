import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Maquina } from '../../../models/Maquina';
import { CrearMaquinaService } from 'src/app/services/crear-maquina.service';

@Component({
  selector: 'app-crear-maquina',
  templateUrl: './crear-maquina.page.html',
  styleUrls: ['./crear-maquina.page.scss'],
})
export class CrearMaquinaPage {

  maquina: Maquina = {
    id_maquina: 0, // Proveer un valor por defecto
    codigo_interno: '',
    id_tipo_maquina: 0,
    marca: '',
    modelo: '',
    id_faena: 0  // Este campo se puede actualizar dinámicamente si es necesario
  };

  constructor(
    private router: Router,
    private crearMaquinaService: CrearMaquinaService
  ) {}

  async agregarMaquina() {
    try {
      // Convertir código interno a mayúsculas
      this.maquina.codigo_interno = this.maquina.codigo_interno.toUpperCase();
      
      const response = await this.crearMaquinaService.crearMaquina(this.maquina).toPromise();
      console.log('Máquina creada exitosamente:', response);
      // Redirigir a una página de éxito o realizar otras acciones después de crear la máquina
      this.router.navigate(['/ruta-de-exito']); // Cambia '/ruta-de-exito' por la ruta deseada
    } catch (error) {
      console.error('Error al crear la máquina:', error);
      // Manejar el error y mostrar un mensaje al usuario
    }
  }
}