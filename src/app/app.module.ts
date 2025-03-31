import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MainHeaderComponent } from './shared/components/main-header/main-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderMenuComponent } from './shared/components/header-menu/header-menu.component';

@NgModule({
  declarations: [AppComponent,HeaderMenuComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule, BrowserAnimationsModule,
      IonicModule.forRoot({
        mode: 'ios',
      }),
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },HttpClient],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {}
