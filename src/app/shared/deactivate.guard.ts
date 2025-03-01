import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root' 
})
export class deactivateGuard implements CanActivate {
  user:any = null;
  constructor( private navCtrl: NavController, private userService: AuthenticationService,
  ){}

async getUserFromLocalStorage(){
  const { value } = await Preferences.get({ key: environment.carServiceStorageKey.user });
  if (value) {
    const userData = JSON.parse(value);      
    this.user = userData;
  }
  }

canActivate() {
this.getUserFromLocalStorage();

  // return from(this.userService.loadUser().then(user => {  
  //     if (user) {
  //       return true;
  //     } else {
  //       this.navCtrl.navigateRoot('auth/login');
  //       return false;
  //     }
      

  // }));
  return true
}
}