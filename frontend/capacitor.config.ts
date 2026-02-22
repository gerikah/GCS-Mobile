import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alkive.gcs',
  appName: 'Ground Control Station',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
