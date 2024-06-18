// src/app/pages/crear-maquina/crear-maquina.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrearMaquinaService } from '../../../services/crear-maquina';
import { MaquinaService } from '../../../services/maquina.service';
import { Maquina } from '../../../models/Maquina'; 
@Component({
  selector: 'app-crear-maquina',
  templateUrl: './crear-maquina.page.html',
  styleUrls: ['./crear-maquina.page.scss'],
})
export class CrearMaquinaPage {

  maquina: Maquina = {
    id_maquina: 0, // Se asignará automáticamente por el backend
    codigo_interno: '',
    id_tipo_maquina: 0,
    id_faena: 0, // Se asignará dinámicamente
    marca: '',
    modelo: ''
  }

  constructor(
    private router: Router,
    private crearMaquinaService: CrearMaquinaService,
    private GetMaquina: MaquinaService

  ) {}

  async agregarMaquina() {
    try {
      // Convertir código interno a mayúsculas
      this.maquina.codigo_interno = this.maquina.codigo_interno.toUpperCase();
      
      const response = await this.crearMaquinaService.crearMaquina(this.maquina).toPromise();
      console.log('Máquina creada exitosamente:', response);
      // Aquí podrías redirigir a una página de éxito o realizar otras acciones después de crear la máquina
    } catch (error) {
      console.error('Error al crear la máquina:', error);
      // Aquí podrías manejar el error y mostrar un mensaje al usuario
    }
  }

}
