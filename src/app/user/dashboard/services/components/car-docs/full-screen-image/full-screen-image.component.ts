import { Component, Input } from '@angular/core';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media, MediaSaveOptions } from '@capacitor-community/media';
import { Camera, CameraResultType } from '@capacitor/camera';

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
  if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
    // On PC / browser, just open image in new tab
    window.open(this.car.car_document, '_blank');
    return;
  }

  // On device
  try {
    const base64Image = await this.getBase64FromUrl(this.car.car_document);
    const result = await Media.savePhoto({
      path: base64Image,
      albumIdentifier: 'Car Documents',
    });
    console.log('Image saved to gallery:', result);
  } catch (error) {
    console.error('Error saving image:', error);
  }
}

// Convert remote image URL to Base64 (works on device)
async getBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return await this.convertBlobToBase64(blob) as string;
}

convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });


}
