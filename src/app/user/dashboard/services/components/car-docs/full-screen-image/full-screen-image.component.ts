import { Component, Input } from '@angular/core';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media, MediaSaveOptions } from '@capacitor-community/media';

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
      // Mobile: save image to Photos
      const base64 = await this.getBase64FromUrl(this.car.car_document);

      // Remove the Base64 prefix (e.g., "data:image/png;base64,") if present
      const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');

      // Save to Photos gallery
      const options: MediaSaveOptions = {
        path: cleanBase64, // Base64-encoded image data
        fileName: `car_document_${new Date().getTime()}.png`, // Optional: specify file name
        // albumIdentifier: 'MyAppAlbum', // Optional: specify an album (uncomment if needed)
      };

      await Media.savePhoto(options);

      const toast = await this.toastCtrl.create({
        message: 'Image saved to Photos!',
        duration: 1500,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();
    } else {
      // Web: open in new tab
      window.open(this.car.car_document, '_blank');
    }
  } catch (err) {
    console.error('Error saving image:', err);
    const toast = await this.toastCtrl.create({
      message: 'Failed to save image.',
      duration: 1500,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }
}

private async getBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

}
