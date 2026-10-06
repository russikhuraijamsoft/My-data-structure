export const env = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
    databaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || '',
    oAuthClientId: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || '',
    recaptchaSiteKey: import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY || '',
  },
  app: {
    env: import.meta.env.VITE_ENV || 'development',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'debug',
  }
};
