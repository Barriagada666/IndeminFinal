import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerChecklistPage } from './ver-checklist.page';

const routes: Routes = [
  {
    path: '',
    component: VerChecklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerChecklistPageRoutingModule {}
