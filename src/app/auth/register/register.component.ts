import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent  implements OnInit {
  registerForm: FormGroup;
  showPassword: boolean = false;

  @Output() type = new EventEmitter<string>();  

  
  constructor(private navCtrl: NavController,
      private authService: AuthenticationService,
      private alertsService:AlertsService) { }


  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        updateOn: 'change',
        validators: [
          Validators.required, Validators.pattern(environment.regexes.email)
        ],
      }),
      password: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      password_confirmation: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required],
      })
    });
  }

  login(){
    this.type.emit('login')
  }

  register(){
    if(this.registerForm.invalid){
      this.alertsService.presentToast('Register form invalid', 'bottom' , 'danger');
      return;
    }
    if(this.registerForm.value.password != this.registerForm.value.password_confirmation){
      this.alertsService.presentToast('Passwords do not match', 'bottom' , 'danger');
      return;
    }
    let data = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password:this.registerForm.value.password,
      password_confirmation:this.registerForm.value.password_confirmation
    }

    this.authService
    .registerAccount(data)
    .pipe(first())
    .subscribe({
      next: (response: any) => {
        if (response) {
          this.alertsService.presentToast('Account Registered Successfully','bottom','success')
          this.login()

        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    
  }

}
