import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { DetailsComponent } from './details/details.component';
import { AvailableCarsComponent } from './available-cars/available-cars.component';
import { MyCarsComponent } from './my-cars/my-cars.component';
import { ServicesComponent } from './services/services.component';
import { ServicedComponent } from './services/components/serviced/serviced.component';
import { NeedsServiceComponent } from './services/components/needs-service/needs-service.component';
import { ModsComponent } from './services/components/mods/mods.component';
import { AddServiceComponent } from './services/components/add-service/add-service.component';
import { ChangeSettingsComponent } from './services/components/change-settings/change-settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
  ],
  declarations: [DashboardPage,DetailsComponent,AvailableCarsComponent,MyCarsComponent,ServicesComponent,ServicedComponent,NeedsServiceComponent,ModsComponent,AddServiceComponent,ChangeSettingsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class DashboardPageModule {}
