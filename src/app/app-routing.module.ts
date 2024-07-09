// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'main', loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule) },
  { path: 'home', loadChildren: () => import('./pages/main/home/home.module').then(m => m.HomePageModule) },
  { path: 'admin', loadChildren: () => import('./pages/main/admin/admin.module').then(m => m.AdminPageModule) },
  { path: 'checklist', loadChildren: () => import('./pages/main/checklist/checklist.module').then(m => m.ChecklistPageModule) },
  { path: 'crear-maquina', loadChildren: () => import('./pages/main/crear-maquina/crear-maquina.module').then(m => m.CrearMaquinaPageModule) },
  { path: 'ver-checklist', loadChildren: () => import('./pages/main/ver-checklist/ver-checklist.module').then(m => m.VerChecklistPageModule) },
  {
    path: 'menu-checklist',
    loadChildren: () => import('./pages/menu-checklist/menu-checklist.module').then( m => m.MenuChecklistPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
