import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTabsPage } from './user-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: UserTabsPage,
    children:[
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTabsPageRoutingModule {}
