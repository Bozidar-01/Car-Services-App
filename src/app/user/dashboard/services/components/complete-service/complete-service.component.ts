import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { first } from 'rxjs';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CarService } from 'src/app/shared/services/car.service';

@Component({
  standalone:false,
  selector: 'app-complete-service',
  templateUrl: './complete-service.component.html',
  styleUrls: ['./complete-service.component.scss'],
})
export class CompleteServiceComponent  implements OnInit {
  serviceForm:FormGroup
  @Input() service:any
  constructor(public modalCtrl: ModalController,
    private alertController: AlertController,
    private carService: CarService,
    private alertService: AlertsService
    ) { }

  ngOnInit() {

    this.serviceForm = new FormGroup({
      price: new FormControl('',Validators.required),
      product_used: new FormControl('',Validators.required),
    })
  }


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
            this.completeService()
          }
        }
      ]
    });

    await alert.present();
  }

  completeService(){

    if(this.serviceForm.invalid){
      this.alertService.presentToast('Please fill the fields above!', 'bottom' , 'danger');
      return;
    }else{
      let data = {
        service_id: this.service.id,
        price: this.serviceForm.value.price,
        product_used: this.serviceForm.value.product_used,
      }


      this.carService.completeService(data).pipe(first()).subscribe({
        next:(response)=>{
          this.alertService.presentToast('Service Complete!', 'bottom' , 'success');
          this.modalCtrl.dismiss({value:response.data})
        }
      })
    }
    }

    

}
