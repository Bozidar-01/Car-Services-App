import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent  implements OnInit {

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

  constructor(private navCtrl: NavController) { }

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
    this.navCtrl.navigateRoot('auth/login')
  }

  goToProfile(){
    this.navCtrl.navigateRoot('authed/user/profile')
  }

  goHome(){
    this.navCtrl.navigateRoot('authed/user/dashboard')
  }

}
