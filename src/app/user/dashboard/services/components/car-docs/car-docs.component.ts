import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CarService } from 'src/app/shared/services/car.service';
import { FullScreenImageComponent } from './full-screen-image/full-screen-image.component';

@Component({
  standalone:false,
  selector: 'app-car-docs',
  templateUrl: './car-docs.component.html',
  styleUrls: ['./car-docs.component.scss'],
})
export class CarDocsComponent  implements OnInit {
  @Input() car:any
  carDoc: any = null; // holds uploaded doc data
chooseFile: FileList | null = null;

  constructor(private carService: CarService,private alertService: AlertsService,public modalCtrl: ModalController) { }

  ngOnInit() {  }

uploadCarDocument(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const formData = new FormData();

  // append the file and car id
  formData.append('car_document', file);
  formData.append('car_id', this.car.id);

  this.carService
    .uploadCarDocument(formData) // make sure your service sends this as multipart/form-data
    .pipe(first())
    .subscribe({
      next: async (res) => {
        this.car.car_document = res.data.car_document;

        this.alertService.presentToast(
          'Car document uploaded!',
          'bottom',
          'success'
        );
      },
      error: (err) => {
        console.error('Error uploading car document:', err);
        this.alertService.presentToast(
          'Upload failed. Try again.',
          'bottom',
          'danger'
        );
      },
    });
}



    async openFullImage() {
    const modal = await this.modalCtrl.create({
      component: FullScreenImageComponent,
      componentProps: {
        car: this.car,
      },
      backdropDismiss: true,
      animated: true,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
 
  }


}
