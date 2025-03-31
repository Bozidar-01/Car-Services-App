import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, first, from, map, Observable, throwError } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { LoginRequest, VerifyRequest, verifyResponse } from '../models/authenticationModels';
import { User } from '../models/user';
import { HttpApiClientService } from './http-api-client.service';
import { NavController } from '@ionic/angular';
import OneSignal from 'onesignal-cordova-plugin';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  signedInUser: any
  private token: string | null = null;
  private userSubject$ = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject$.asObservable();


  constructor(private httpApiClient: HttpApiClientService,private navCtrl: NavController) { 
    this.loadInitialData();
  }


  login(loginRequest: LoginRequest): Observable<verifyResponse> {
    const apiUrl = 'login'; 
    
    return this.httpApiClient.post<any>(apiUrl, loginRequest, true, true).pipe(
      map(response => {
        
        if (response.status !== 200) {
          console.error('Invalid login response:', response.message);
          throw new Error(response.message);
        }
      

        this.signedInUser = response.data.user
  
        // Log the parsed login response
        if (response.status === 200) {
         
          if(response.data.user){
            const newLoginReq: verifyResponse = {
              token: response.data.token,
            };
            let userData = response.data.user
            let user = new User();
            user = {
              id: userData.id,
              name: userData.name,
              email: userData.email,              
              profile_pic: userData.profile_pic,              
            }
            Preferences.set({
              key: environment.carServiceStorageKey.user, value: JSON.stringify(user)
            })
            Preferences.set({
              key: environment.carServiceStorageKey.token,
              value: JSON.stringify(newLoginReq)
            });
              this.httpApiClient.setToken(newLoginReq);
              
            this.userSubject$.next(user);
          }
            
        } 
        else{
          this.userSubject$.next(null);

        }

  
        return response;
      }),
      catchError(error => {
        // Log the error details
        console.error('Login Error:', error);
        return throwError(error);
      })
    );

  }

  setToken(token: verifyResponse) {
    this.httpApiClient.setToken(token);
  }

  getUserData(): Observable<User | null> {
    return from(Preferences.get({ key: environment.carServiceStorageKey.user })).pipe(
      map(result => {
        if (result.value) {
          try {
            this.signedInUser = JSON.parse(result.value);
            this.userSubject$.next(this.signedInUser);
            return this.signedInUser;
          } catch (error) {
            console.error('Error parsing user data from local storage:', error);
            this.userSubject$.next(null);
            return null;
          }
        } else {
          this.userSubject$.next(null);
          return null;
        }
      })
    );
  }


  loadUser(): Promise<User | null> {
    return new Promise(resolve => {
      this.getUserData().subscribe({
        next: user => resolve(user),
        error: () => resolve(null)
      });
    });
  }




  private async loadInitialData() {
    try {
      const tokenResult = await Preferences.get({ key: environment.carServiceStorageKey.token });
      const tokenValue = tokenResult.value ? JSON.parse(tokenResult.value).token : null;
      
      if (tokenValue) {
        this.token = tokenValue;
        this.httpApiClient.setToken({ token: tokenValue });
      }

      const userResult = await Preferences.get({ key: environment.carServiceStorageKey.user });
      if (userResult.value) {
        const user = JSON.parse(userResult.value);
        this.userSubject$.next(user);
        this.httpApiClient.setUserRole(user.role);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  public  logout() {
    this.httpApiClient.post('logout',null,true,true).pipe(first()).subscribe(res=>{
      if(res.status){
        this.userSubject$.next(null);
        Preferences.remove({key: environment.carServiceStorageKey.token});
        Preferences.remove({key: environment.carServiceStorageKey.user});
        this.httpApiClient.setToken(null);

        this.navCtrl.navigateRoot('auth/login')
        this.httpApiClient.setUserRole(null);

        const platform = Capacitor.getPlatform();
        if (platform === 'ios' || platform === 'android') {
          OneSignal.logout();
        }
      }
    })

  }



  public get userValue(): User {
    return this.userSubject$.value;
  }
  
}