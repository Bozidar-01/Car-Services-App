import { Component, OnInit, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { register } from 'swiper/element/bundle';
import { User } from './shared/models/user';
import { HeaderMenuComponent } from './shared/components/header-menu/header-menu.component';
import { UserService } from './shared/services/user.service';
import { BehaviorSubject, first } from 'rxjs';
import { PublicService } from './shared/services/public.service';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ScreenOrientation } from '@capacitor/screen-orientation';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  @ViewChild(HeaderMenuComponent) headerMenu: HeaderMenuComponent;
  constructor(public publicService: PublicService) {
    if (Capacitor.getPlatform() === 'android') {
      this.initializeApp();
      this.lockOrientation();
    }
  }

  ngOnInit() {
  }

  loadUserData() {
    if (this.headerMenu) {
      this.headerMenu.loadUserData();
    }
  }

  initializeApp() {
    this.setStatusBarStyle();
  }


  async setStatusBarStyle() {
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.setStyle({ style: Style.Light });
    }
  }

  async lockOrientation() {
    await ScreenOrientation.lock({ orientation: 'portrait' });
  }

}
