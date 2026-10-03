import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";
import appletConfig from '../../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId,
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || "(default)");
    storage = getStorage(app);
    
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported) {
          try {
            analytics = getAnalytics(app);
          } catch {
            // Analytics dynamic config fetch not available or blocked, safely ignored
          }
        }
      }).catch(() => {
        // Analytics unsupported
      });
    }

    if (db) {
      const testConnection = async () => {
        try {
          await getDocFromServer(doc(db, 'system', 'connection_test'));
        } catch (error) {
          if (error instanceof Error && error.message.includes('the client is offline')) {
            console.warn("Please check your Firebase configuration. The client is offline.");
          }
        }
      };
      testConnection();
    }
  } catch (error) {
    console.warn("Firebase initialization failed. Check environment variables.", error);
  }
} else {
  console.warn("Firebase configuration is missing. The app will run in degraded mode without backend access.");
}

export { app, auth, db, storage, analytics };
