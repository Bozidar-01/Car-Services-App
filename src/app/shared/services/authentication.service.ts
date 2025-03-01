import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, throwError } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { LoginRequest, VerifyRequest, verifyResponse } from '../models/authenticationModels';
import { User } from '../models/user';
import { HttpApiClientService } from './http-api-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  signedInUser: any
  private token: string | null = null;
  private userSubject$ = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject$.asObservable();


  constructor(private httpApiClient: HttpApiClientService) { 
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
      

        this.signedInUser = response.user
  
        // Log the parsed login response
        if (response.status === 200) {
          // let userData = response.user
          // let user = {
          //   email: userData.email,
          //   device_id:userData.device_id,
          //   verification_code: userData.verification_code
            
          // }
          // console.log(userData)
          
         
          // if(response.user.is_admin==='1'){
          //   const newLoginReq: verifyResponse = {
          //     token: response.user.token,
          //   };
          //   let userData = response.user
          //   let user = new User();
          //   user = {
          //     id: userData.id,
          //     name: userData.name,
          //     email: userData.email,
          //     is_admin:userData.is_admin,
          //     phone:userData.phone,
          //     token:userData.token,
          //     device_id:userData.device_id,
          //     verification_code:userData.verification_code,
          //     created_at:userData.created_at,
          //     updated_at:userData.updated_at,
              
          //   }
          //   Preferences.set({
          //     key: environment.tipptioStorageKey.user, value: JSON.stringify(user)
          //   })
          //   Preferences.set({
          //     key: environment.tipptioStorageKey.token,
          //     value: JSON.stringify(newLoginReq)
          //   });
          //     this.httpApiClient.setToken(newLoginReq);
              
          //   this.userSubject$.next(user);
          //   this.httpApiClient.setUserRole(user.is_admin)  
          // }
            
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

  resendNumber(loginRequest: LoginRequest): Observable<verifyResponse> {
    const apiUrl = 'resend'; 
    
    return this.httpApiClient.post<any>(apiUrl, loginRequest, true, true).pipe(
      map(response => {
        
        if (response.status !== 200) {
          console.error('Invalid login response:', response.message);
          throw new Error(response.message);
        }
      

        // this.signedInUser = response.data


  
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

  verifyCode(VerifyRequest: VerifyRequest): Observable<verifyResponse> {
    const apiUrl = 'verify'; 

  
    return this.httpApiClient.post<any>(apiUrl, VerifyRequest, true, true).pipe(
      map(response => {

        if (response.status !== 200) {
          console.error('Invalid login response:', response.message);
          throw new Error(response.message);
        }
   
        
        const newLoginReq: verifyResponse = {
          token: response.data.token,
        };

        this.signedInUser = response.user
  
        // Log the parsed login response
        let user = new User();
        if (response.data) {
          let userData = response.data
          user = {
            id: userData.id,
            accuracy: userData.accuracy,
            followers: userData.followers,
            following: userData.following,
            following_users: userData.following_users,
            first_name: userData.first_name,
            last_name: userData.last_name,
            favorite_team: userData.favorite_team,
            email: userData.email,
            badge_days_7: userData.badge_days_7,
            badge_days_31: userData.badge_days_31,
            balance: userData.balance,
            bio: userData.bio,
            expert: userData.expert,
            payments: userData.payments,
            points: userData.points,
            last_week_rank: userData.last_week_rank,
            overall: userData.overall,
            winning: userData.winning,
            profile_picture: userData.profile_picture,
            rank: userData.rank,
            autorenew: userData.autorenew,
            rate: userData.rate,
            subscription: userData.subscription,
            subscription_ends_at: userData.subscription_ends_at,
            token:userData.token,          
          }
       

              Preferences.set({
                key: environment.carServiceStorageKey.user, value: JSON.stringify(user)
              })

              this.userSubject$.next(user);
              // this.httpApiClient.setUserRole(user)  
            
        } 
        else{
          this.userSubject$.next(null);

        }

        Preferences.set({
          key: environment.carServiceStorageKey.token,
          value: JSON.stringify(newLoginReq)
        });
          this.httpApiClient.setToken(newLoginReq);


  
        return response;
      }),
      catchError(error => {
        console.error('Login Error:', error);
        return throwError(error);
      })
    );
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



}