import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../shared/services/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs';
import { AlertsService } from '../shared/services/alerts.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  standalone:false,
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  loginForm: FormGroup;

  constructor(private navCtrl: NavController,
    private authService: AuthenticationService,
    private alertsService:AlertsService,
    private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        updateOn: 'change',
        validators: [
          Validators.required, Validators.pattern(environment.regexes.email)
        ],
      }),
      password: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required],
      })
    });
  }


  login(){
    if(this.loginForm.valid){

      let data = {
        email: this.loginForm.value.email,
        password:this.loginForm.value.password
      }
      
      this.authService
      .login(data)
      .pipe(first())
      .subscribe({
        next: async (response:any) => {
          if(response.meta == 'logged-in'){
            this.alertsService.presentToast('Logged in!', 'bottom' , 'success');

            this.navCtrl.navigateForward('authed/user/dashboard')
          }

          },
          error: (error) => {
            console.log(error);
            
            this.alertsService.presentToast('There was an issue please try again', 'bottom' , 'danger');
            
            // this.navCtrl.navigateForward('/welcome/auth/email-verification');
          },
        });
        
      }else{
        this.alertsService.presentToast('Login form invalid', 'bottom' , 'danger');
      }
        
      }
}
