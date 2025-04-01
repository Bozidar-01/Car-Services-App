import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { IonContent } from '@ionic/angular';
import { BehaviorSubject, first } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { PublicService } from 'src/app/shared/services/public.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone:false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;
  chooseFile:any
  userForm: FormGroup
  private userSubject$ = new BehaviorSubject<User | null>(null);

    @ViewChild(IonContent, { static: false }) content!: IonContent;
  constructor(private userService:UserService, 
    private authService: AuthenticationService,
  private alertService: AlertsService,
  private publicService:PublicService) { }

  ngOnInit() {
    this.user = this.authService.userValue;

    this.userForm = new FormGroup({
      name: new FormControl(this.user?.name,Validators.required),
      email: new FormControl(this.user?.email,Validators.required),
      password: new FormControl(''),
    })
  }

  ionViewWillEnter() {
    this.user = this.authService.userValue;
  }

  
  popFileChooser(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    let formData = new FormData();
    this.chooseFile = input.files;
    formData.append('profile_pic', this.chooseFile[0]);

    this.userService
      .updateProfilePic(formData)
      .pipe(first())
      .subscribe({
        next: async (res) => {
          this.user.profile_pic = res.data.profile_pic; 

          await Preferences.set({
            key: environment.carServiceStorageKey.user,
            value: JSON.stringify(this.user),
          });

          this.authService
            .getUserData()
            .pipe(first())
            .subscribe({
              next: (userData) => {
                this.user = { ...this.user, profile_pic: userData.profile_pic };
                this.userSubject$.next(this.user);
                this.publicService.updateUser(this.user)

              },
              error: (err) => {
                console.error('Error fetching user data:', err);
              },
            });
            this.alertService.presentToast('Profile Picture Updated!', 'bottom' , 'success');

        },
        error: (err) => {
          console.error('Error uploading profile pic:', err);
        },
      });
  }
  
  scrollToTop() {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        this.content.scrollToTop(300);
      }
    }, 200);
  }


  updateUser(){
    if(this.userForm.invalid){
      this.alertService.presentToast('Please fill the fields above!', 'bottom' , 'danger');
      return;
    }else{
      let data = {}

      if(this.userForm.value.password !== ''){
         data = {
          name:this.userForm.value.name,
          email:this.userForm.value.email,
          password:this.userForm.value.password
        }
      }else{
        data = {
          name:this.userForm.value.name,
          email:this.userForm.value.email,
        }
      }
      
      this.userService.updateUser(data).pipe(first()).subscribe({
        next: async (response)=>{
          this.user = response.data
          await Preferences.set({
            key: environment.carServiceStorageKey.user,
            value: JSON.stringify(this.user),
          });

          this.userSubject$.next(this.user);
          this.publicService.updateUser(this.user)

          this.alertService.presentToast('Profile Updated!', 'bottom' , 'success');

        }
      })
    }
    
  }

}
