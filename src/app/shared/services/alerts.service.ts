import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  numberOfLoaders: number = 0;
  loader: any;


  constructor( private loadingCtrl: LoadingController, private toastCtrl: ToastController ) { }

  presentLoadingController(status: boolean) {
    if (status) {
      if (this.numberOfLoaders == 0) {
        this.loadingCtrl
          .create({
            spinner: 'crescent',
            mode: 'ios',
            animated: true,
            backdropDismiss: false,
            showBackdrop: true,
            translucent: true,
            cssClass: 'loading-spinner-design',
          })
          .then((toast) => {
            this.loader = toast;
            this.loader.present();
          });
      }
      this.numberOfLoaders++;
    } else {
      this.numberOfLoaders--;
      if (this.numberOfLoaders == 0) {
        this.loader.dismiss();
      }
    }
  }

  async presentToast(text:any, position:any, color:any) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 1500,
      color: color,
      position: position,
    });
    await toast.present();
  }


}