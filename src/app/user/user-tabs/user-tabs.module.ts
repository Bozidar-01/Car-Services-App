import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTabsPageRoutingModule } from './user-tabs-routing.module';

import { UserTabsPage } from './user-tabs.page';
import { MainHeaderComponent } from 'src/app/shared/components/main-header/main-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTabsPageRoutingModule,
  ],
  declarations: [UserTabsPage, MainHeaderComponent]
})
export class UserTabsPageModule {}
