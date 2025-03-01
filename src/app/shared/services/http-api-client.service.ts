/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Network } from '@capacitor/network';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { verifyResponse } from '../models/authenticationModels';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root',
})
export class HttpApiClientService {
  private API_ENDPOINTBASE: string;
  private API_ENDPOINT: string;
  currentRoute: String = '';
  hasLoadingController = false;
  private userToken: BehaviorSubject<verifyResponse>;
  private userRole: any = null;
  private connectionErrorShown = false;



  constructor(
    private http: HttpClient,
    private alerts: AlertsService,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.API_ENDPOINTBASE = environment.baseLink;
    this.API_ENDPOINT = environment.apiLink;

    this.userToken = new BehaviorSubject<verifyResponse>(null!);

  }

  private async checkInternetConnection(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  private handleNetworkError(err: any, showLoader: boolean) {
    if (err && err.message && err.message.includes('ERR_INTERNET_DISCONNECTED')) {
      if (!this.connectionErrorShown) {
        this.alerts.presentToast('No internet connection. Please check your network settings.', 'bottom', 'danger');
        this.connectionErrorShown = true; // Set the flag to true after showing the error
      }
    } else {
      this.alerts.presentToast('An error occurred. Please try again.', 'bottom', 'danger');
    }
  
    if (showLoader) {
      this.alerts.presentLoadingController(false);
    }
  
    // Reset the connection error flag after a short delay or upon specific conditions
    setTimeout(() => {
      this.connectionErrorShown = false;
    }, 10000); // Reset flag after 10 seconds, adjust as needed
  
    return throwError(err);
  }
  

  logoutOnError() {
        //  Preferences.remove({key:environment.mangoTravelStorageKey.user})
        //  Preferences.remove({key:environment.mangoTravelStorageKey.token})
        //  Preferences.remove({key:'allTrips'})
        //  Preferences.remove({key:'user'})

    // this.setToken(null!);

    // this.navCtrl.navigateRoot('/auth/login');
    // this.setUserRole(null!);
    window.location.reload();
  }

  setUserRole(role: string) {
    this.userRole = role;
  }

  get getUserRole() {
    return this.userRole;
  }

  get getUserToken() {
    return this.userToken.value;
  }

  setToken(tokenData: verifyResponse): void {
    this.userToken.next(tokenData);
  }

  async getTokenFromStorage() {
    let token: any = await Preferences.get({
      key: environment.carServiceStorageKey.token,
    });
    return token;
  }



  private setHeaders(
    inHeaders: HttpHeaders,
    isFileUpload = false,
    isWithSocketId = true
  ) {
    var headers = new HttpHeaders();

    // headers = headers.set('Content-Type','multipart/form-data')
    headers = headers.set('Access-Control-Allow-Origin', '*');

    if (this.getUserToken) {
      headers = headers.set('Authorization', `Bearer ${this.getUserToken.token}`);
    }

    headers = headers.set(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    );

    if (inHeaders) {
      for (let key of inHeaders.keys()) {
        const value = inHeaders.get(key);
        if (value !== null) {
          headers = headers.set(key, value);
        }
      }
    }

    return headers;
  }

  private setParams(params: any = {}) {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] != null) {
        httpParams = httpParams.append(key, params[key]);
      }
    }
    return httpParams;
  }

  get<T>(
    url: string,
    showLoader = false,
    xheaders?: HttpHeaders
  ): Observable<any> {
    if (showLoader) {
      this.alerts.presentLoadingController(true);
    }

    let apiUrl = `${this.API_ENDPOINT}/${url}`;

    return from(this.checkInternetConnection()).pipe(
      switchMap((connected) => {
        if (!connected) {
          this.alerts.presentToast('No internet connection. Please check your network settings.', 'bottom', 'danger');
          return throwError('No internet connection');
        }
        return this.http.get<any>(apiUrl, {
          params: this.setParams({}),
          headers: this.setHeaders(xheaders!),
        }).pipe(
          catchError((err) => this.handleNetworkError(err, showLoader)),
          map((response) => {
            if (showLoader) {
              setTimeout(() => {
                this.alerts.presentLoadingController(false);
              }, 500);
            }
            return response;
          })
        );
      })
    );
  }

  delete<T>(
    url: string,
    showLoader = false,
    xheaders?: HttpHeaders
  ): Observable<any> {
    let apiUrl = `${this.API_ENDPOINT}/${url}`;

    if (showLoader) {
      this.alerts.presentLoadingController(true);
    }

    return from(this.checkInternetConnection()).pipe(
      switchMap((connected) => {
        if (!connected) {
          this.alerts.presentToast('No internet connection. Please check your network settings.', 'bottom', 'danger');
          return throwError('No internet connection');
        }
        return this.http.delete<any>(apiUrl, {
          params: this.setParams({}),
          headers: this.setHeaders(xheaders!),
        }).pipe(
          catchError((err) => this.handleNetworkError(err, showLoader)),
          map((response) => {
            this.hasLoadingController = false;
            if (showLoader) {
              this.alerts.presentLoadingController(false);
            }
            return response;
          })
        );
      })
    );
  }

  post<T>(
    url: string,
    params: object = {},
    showLoader = false,
    isVerify: boolean = true
  ): Observable<any> {
    let apiUrl = `${this.API_ENDPOINT}/${url}`;

    if (showLoader) {
      this.alerts.presentLoadingController(true);
    }

    let headers = new HttpHeaders();
    if (isVerify) {
      headers = this.setHeaders(headers, true);
    }

    return from(this.checkInternetConnection()).pipe(
      switchMap((connected) => {
        if (!connected) {
          this.alerts.presentToast('No internet connection. Please check your network settings.', 'bottom', 'danger');
          return throwError('No internet connection');
        }
        return this.http.post<any>(apiUrl, params, {
          params: this.setParams({}),
          headers: headers,
        }).pipe(
          catchError((err) => this.handleNetworkError(err, showLoader)),
          map((response) => {
            if (showLoader) {
              setTimeout(() => {
                this.alerts.presentLoadingController(false);
              }, 500);
            }
            return response;
          })
        );
      })
    );
  }

  patch<T>(
    url: string,
    params: object = {},
    showLoader = true
  ): Observable<any> {
    let apiUrl = `${this.API_ENDPOINT}/${url}`;

    if (showLoader) {
      this.alerts.presentLoadingController(true);
    }

    const headers = new HttpHeaders();

    return from(this.checkInternetConnection()).pipe(
      switchMap((connected) => {
        if (!connected) {
          this.alerts.presentToast('No internet connection. Please check your network settings.', 'bottom', 'danger');
          return throwError('No internet connection');
        }
        return this.http.patch<any>(apiUrl, params, {
          params: this.setParams({}),
          headers: this.setHeaders(headers, true),
        }).pipe(
          catchError((err) => this.handleNetworkError(err, showLoader)),
          map((response) => {
            if (showLoader) {
              setTimeout(() => {
                this.alerts.presentLoadingController(false);
              }, 500);
            }
            return response;
          })
        );
      })
    );
  }

  put<T>(
    url: string,
    params: {},
    showLoader = true,
    xheaders?: HttpHeaders
  ): Observable<any> {
    let apiUrl = `${this.API_ENDPOINT}/${url}`;
    if (showLoader) {
      this.alerts.presentLoadingController(true);
    }

    return from(this.checkInternetConnection()).pipe(
      switchMap((connected) => {
        if (!connected) {
          this.alerts.presentToast('No internet connection. Please check your network settings.', 'bottom', 'danger');
          return throwError('No internet connection');
        }
        return this.http.put<any>(apiUrl, params, {
          params: this.setParams({}),
          headers: this.setHeaders(xheaders!),
        }).pipe(
          catchError((err) => this.handleNetworkError(err, showLoader)),
          map((response) => {
            this.hasLoadingController = false;
            this.alerts.presentLoadingController(false);
            return response;
          })
        );
      })
    );
  }

}