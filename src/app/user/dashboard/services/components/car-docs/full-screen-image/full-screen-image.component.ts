import { Component, Input } from '@angular/core';
import { ModalController, ToastController, Platform } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-full-screen-image',
  templateUrl: './full-screen-image.component.html',
  styleUrls: ['./full-screen-image.component.scss'],
})
export class FullScreenImageComponent {
  @Input() car: any;

  pressing = false;
  private pressTimeout: any;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController, private platform: Platform) {}

  close() {
    this.modalCtrl.dismiss();
  }

  startPress(event: Event) {
    event.preventDefault();
    this.pressing = true;
    this.pressTimeout = setTimeout(() => {
      this.saveImage();
      this.pressing = false;
    }, 1000); // 1 second hold
  }

  cancelPress() {
    this.pressing = false;
    clearTimeout(this.pressTimeout);
  }

  async saveImage() {
    try {
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        // Native save logic for mobile
        const base64 = await this.getBase64FromUrl(this.car.car_document);
        // Use Capacitor Filesystem or other plugin to save
        // Example: await Filesystem.writeFile({ path: 'car_doc.jpg', data: base64, directory: Directory.Documents });
      } else {
        // Browser: trigger download
        const link = document.createElement('a');
        link.href = this.car.car_document;
        link.download = 'car_document.jpg';
        link.click();
      }

      const toast = await this.toastCtrl.create({
        message: 'Image saved successfully!',
        duration: 1500,
        color: 'success',
        position: 'bottom',
      });
      toast.present();
    } catch (err) {
      console.error(err);
      const toast = await this.toastCtrl.create({
        message: 'Failed to save image.',
        duration: 1500,
        color: 'danger',
        position: 'bottom',
      });
      toast.present();
    }
  }

  private async getBase64FromUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
