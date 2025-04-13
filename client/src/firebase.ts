import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your Firebase config type
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "listafriendly.firebaseapp.com",
  projectId: "listafriendly",
  storageBucket: "listafriendly.firebasestorage.app",
  messagingSenderId: "1041436919236",
  appId: "1:1041436919236:web:1f4d6af4fdfdd7e37b9091"
};

// Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// Initialize Firebase
let app: FirebaseApp;

try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

// Initialize services with types
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Export typed services
export { auth, db, storage };

// Utility types you might need
export type User = import("firebase/auth").User;
export type DocumentData = import("firebase/firestore").DocumentData;
export type QueryDocumentSnapshot = import("firebase/firestore").QueryDocumentSnapshot;