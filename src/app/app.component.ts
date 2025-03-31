import { Component, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { register } from 'swiper/element/bundle';
import { User } from './shared/models/user';
import { HeaderMenuComponent } from './shared/components/header-menu/header-menu.component';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  user:User
  @ViewChild(HeaderMenuComponent) headerMenu: HeaderMenuComponent;
  constructor() {}

  loadUserData() {
    if (this.headerMenu) {
      this.headerMenu.loadUserData();
    }
  }
}
