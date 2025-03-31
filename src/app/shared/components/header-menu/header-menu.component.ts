import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent  implements OnInit {
  user:any;

  roadsideContacts = [
    {
      name: 'AMSM',
      contact: '196'
    },
    {
      name: 'Police',
      contact: '192'
    },
    {
      name: 'Fire Department',
      contact: '193'
    }
  ]

  constructor(private navCtrl: NavController, private authService: AuthenticationService) { }

  ngOnInit() {}

  callNow(number: string) {
    if (number) {
      const phoneUrl = `tel:${number}`;
      window.open(phoneUrl, '_system'); // Opens the native dialer
    } else {
      console.log('Invalid phone number');
    }
  }

  logOut(){
    this.authService.logout()
  }

  goToProfile(){
    this.navCtrl.navigateRoot('authed/user/profile')
  }

  goHome(){
    this.navCtrl.navigateRoot('authed/user/dashboard')
  }

  async loadUserData() {
    const { value } = await Preferences.get({ key: environment.carServiceStorageKey.user });
    if (value) {
      this.user = JSON.parse(value);
    }
  
    this.authService
      .getUserData()
      .pipe(first())
      .subscribe({
        next: (userData: User) => {
          this.user = userData;
          Preferences.set({
            key: environment.carServiceStorageKey.user,
            value: JSON.stringify(this.user),
          });
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
  }

}
