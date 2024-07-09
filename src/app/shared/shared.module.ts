import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    HeaderMenuComponent  // Declara el componente aquí
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    HeaderMenuComponent,  // Exporta el componente aquí
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
