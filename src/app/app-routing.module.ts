import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { deactivateGuard } from './shared/deactivate.guard';
import { authGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  {
    path: 'authed',
    children:[
      {
        path:'user',
        loadChildren: () => import('./user/user-tabs/user-tabs.module').then( m => m.UserTabsPageModule)
      }
    ], canActivate: [deactivateGuard] 
  },
  {
    path: 'auth',
    canActivate: [authGuard],
    children: [
      {
        path: 'login',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
      },

    ]
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
