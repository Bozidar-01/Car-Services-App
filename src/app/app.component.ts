import { Component, OnInit, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { register } from 'swiper/element/bundle';
import { User } from './shared/models/user';
import { HeaderMenuComponent } from './shared/components/header-menu/header-menu.component';
import { UserService } from './shared/services/user.service';
import { BehaviorSubject, first } from 'rxjs';
import { PublicService } from './shared/services/public.service';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  user:User
  private userSubject$ = new BehaviorSubject<User | null>(null);
  @ViewChild(HeaderMenuComponent) headerMenu: HeaderMenuComponent;
  constructor(private userService:UserService,public publicService: PublicService) {}

  ngOnInit() {
    this.getUser()
  }

  loadUserData() {
    if (this.headerMenu) {
      this.headerMenu.loadUserData();
    }
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
