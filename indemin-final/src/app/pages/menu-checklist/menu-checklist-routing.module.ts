import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuChecklistPage } from './menu-checklist.page';

const routes: Routes = [
  {
    path: '',
    component: MenuChecklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuChecklistPageRoutingModule {}
