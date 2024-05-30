import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/main/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/main/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'checklist',
    loadChildren: () => import('./pages/main/checklist/checklist.module').then(m => m.ChecklistPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
