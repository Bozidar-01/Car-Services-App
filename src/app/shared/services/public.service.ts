import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private userSubject = new BehaviorSubject<any>(null); // Store and emit user data
  public user$: Observable<any> = this.userSubject.asObservable();
  

  constructor() { }


  getUserData(){
    return from(Preferences.get({ key: environment.carServiceStorageKey.user })).pipe(
      map(result => {
        if (result.value) {
          try {
            this.userSubject.next(JSON.parse(result.value));
            return JSON.parse(result.value);
          } catch (error) {
            console.error('Error parsing user data from local storage:', error);
            return null;
          }
        } else {
          return null;
        }
      })
    );
  }


    // Update user data manually (e.g., from modal)
    updateUser(userData: any) {
      this.userSubject.next(userData); // Emit the updated user data to all subscribers
    }
  
    // Get the current user value (for one-time access, if needed)
    getCurrentUser(): any {
      return this.userSubject.value;
    }
}
