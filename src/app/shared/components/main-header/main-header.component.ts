import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { BehaviorSubject, first, Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import User from 'onesignal-cordova-plugin/dist/UserNamespace';

@Component({
  standalone:false,
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent  implements OnInit {
  isVisible: boolean = true;
  private userSubscription: Subscription | null = null;
  private userSubject$ = new BehaviorSubject<User | null>(null);

  user: any = null;

  
  constructor(private router: Router,public publicService: PublicService) { 
    this.router.events.subscribe(() => {
      this.isVisible = this.router.url !== '/authed/user/profile';
    });
  }
  

  ngOnInit() {
    this.getUserData()
    this.userSubscription = this.publicService.user$.subscribe({
      next: (userData) => {
        if (userData) {
          this.user = userData;
        } else {
          console.log('No user data found');
          this.user = null;
        }
      },
      error: (error) => {
        console.error('Error subscribing to user data:', error);
      }
    });
  }

  goHome(){}

  getUserData(){
        this.publicService.getUserData().pipe(first()).subscribe({
          next:(response)=>{
            this.user = response
              Preferences.set({
                key: environment.carServiceStorageKey.user, 
                value: JSON.stringify(this.user)
              });
              this.userSubject$.next(this.user);
          }
        })
  }
  
}
