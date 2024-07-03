import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuChecklistPageRoutingModule } from './menu-checklist-routing.module';

import { MenuChecklistPage } from './menu-checklist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuChecklistPageRoutingModule
  ],
  declarations: [MenuChecklistPage]
})
export class MenuChecklistPageModule {}
