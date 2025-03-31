import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, from, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService
  ) {}
  
  
  canActivate(): Observable<boolean> {
    return from(this.authService.loadUser().then(user => {
      if (user) {
        this.navCtrl.navigateRoot('authed/user/dashboard');
        return false;
      } else {
        return true;
      }
      return true;
    }));
  }
}