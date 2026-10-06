import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.talkos.restaurant',
  appName: 'TalkOS',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
