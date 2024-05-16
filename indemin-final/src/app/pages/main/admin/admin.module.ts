import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderMenuComponent } from 'src/app/shared/components/header-menu/header-menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    SharedModule
  ],
  declarations: [AdminPage, HeaderMenuComponent]
})
export class AdminPageModule {}
