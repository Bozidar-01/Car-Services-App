import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../shared/services/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs';
import { AlertsService } from '../shared/services/alerts.service';
import { Preferences } from '@capacitor/preferences';
import OneSignal from 'onesignal-cordova-plugin';
import { Capacitor } from '@capacitor/core';

@Component({
  standalone:false,
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  loginForm: FormGroup;
  type: string = 'login';

  constructor(private navCtrl: NavController,
    private authService: AuthenticationService,
    private alertsService:AlertsService,
    private change: ChangeDetectorRef) { }

  ngOnInit() {}

    changeType(event:any){
      this.type = event;
    }
}
