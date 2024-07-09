import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerChecklistPageRoutingModule } from './ver-checklist-routing.module';

import { VerChecklistPage } from './ver-checklist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerChecklistPageRoutingModule
  ],
  declarations: [VerChecklistPage]
})
export class VerChecklistPageModule {}
