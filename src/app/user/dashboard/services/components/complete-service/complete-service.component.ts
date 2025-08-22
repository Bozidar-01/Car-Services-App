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
export class CompleteServiceComponent implements OnInit {
  serviceForm: FormGroup;
  usedProduct = false;
  customKm = false;
  customDate = false;
    maxDate = new Date().toISOString(); 
  @Input() service: any;

  constructor(
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private carService: CarService,
    private alertService: AlertsService
  ) {}

    ngOnInit() {
    this.serviceForm = new FormGroup({
      price: new FormControl('', Validators.required),
      product_used: new FormControl(null),
      custom_km: new FormControl(null),
      custom_date: new FormControl(null),
    });
  }

  selectDate(event: any) {
    const date = event.detail.value;
    this.serviceForm.get('custom_date')?.setValue(date);
  }

    async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Service Confirmation',
      message: 'Is the service completed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => this.completeService(),
        },
      ],
    });

    await alert.present();
  }


  completeService() {
    if (this.serviceForm.invalid) {
      this.alertService.presentToast('Please fill the fields above!', 'bottom', 'danger');
      return;
    }

    let data: any = {
      service_id: this.service.id,
      price: this.serviceForm.value.price,
      product_used: this.serviceForm.value.product_used,
    };

    if (this.customDate) {
      data.custom_date = this.serviceForm.value.custom_date;
    }

    if (this.customKm) {
      data.custom_km = this.serviceForm.value.custom_km;
    }

    this.carService.completeService(data).pipe(first()).subscribe({
      next: (response) => {
        this.alertService.presentToast('Service Complete!', 'bottom', 'success');
        this.modalCtrl.dismiss({ value: response.data });
      },
    });
  }
}

