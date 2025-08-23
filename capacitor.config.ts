import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carService.mk',
  appName: 'Service Tracker',
  webDir: 'www',
  plugins: {
    Media: {
      androidGalleryMode: true
    },
    Keyboard: {
      resize: 'body', 
      style: 'light',
    },
  }
};

export default config;
