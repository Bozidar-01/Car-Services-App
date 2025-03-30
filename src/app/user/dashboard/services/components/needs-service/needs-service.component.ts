import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-needs-service',
  templateUrl: './needs-service.component.html',
  styleUrls: ['./needs-service.component.scss'],
})
export class NeedsServiceComponent implements OnInit {
  
  constructor(private alertController: AlertController) { }

  ngOnInit() {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Service Confirmation',
      message: 'Is the service completed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Service completion cancelled');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Service marked as completed');
            // Add your completion logic here
          }
        }
      ]
    });

    await alert.present();
  }
}