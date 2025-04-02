import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { PublicService } from 'src/app/shared/services/public.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BehaviorSubject, first } from 'rxjs';
import User from 'onesignal-cordova-plugin/dist/UserNamespace';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
@Component({
  standalone:false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0 }))
      ]),
  
      transition(':enter', [
        style({ opacity: 0 }), 
        animate('200ms ease-in-out', style({ opacity: 1 })) 
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0 })) 
      ])
    ]),
  ]
})
export class DashboardPage implements OnInit {
    user:User
    private userSubject$ = new BehaviorSubject<User | null>(null);
  carsSegment:string = 'available'
  constructor(private userService:UserService,public publicService: PublicService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getUser()
  }
  

  changeSegment(event:any){
    setTimeout(() => {
      this.carsSegment = event.detail.value
    }, 200);
  }


  getUser(){
    this.userService.getUserData().pipe(first()).subscribe({
      next:async(response)=>{
        this.user = response.data;
        await Preferences.set({
          key: environment.carServiceStorageKey.user,
          value: JSON.stringify(this.user),
        });

        this.userSubject$.next(this.user);
        this.publicService.updateUser(this.user)
      }
    })
  }
  

}
