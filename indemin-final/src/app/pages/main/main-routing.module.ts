import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'checklist',
    loadChildren: () => import('./checklist/checklist.module').then( m => m.ChecklistPageModule)
  },  {
    path: 'ver-checklist',
    loadChildren: () => import('./ver-checklist/ver-checklist.module').then( m => m.VerChecklistPageModule)
  },
  {
    path: 'crear-maquina',
    loadChildren: () => import('./crear-maquina/crear-maquina.module').then( m => m.CrearMaquinaPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
