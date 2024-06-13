import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearMaquinaPageRoutingModule } from './crear-maquina-routing.module';

import { CrearMaquinaPage } from './crear-maquina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMaquinaPageRoutingModule
  ],
  declarations: [CrearMaquinaPage]
})
export class CrearMaquinaPageModule {}
