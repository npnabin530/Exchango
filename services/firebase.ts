import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBuGvKEYML89HYK-GzL-hPXf6ly-JXvNdA",
  authDomain: "hale-mercury-462109-s4.firebaseapp.com",
  databaseURL: "https://hale-mercury-462109-s4-default-rtdb.firebaseio.com",
  projectId: "hale-mercury-462109-s4",
  storageBucket: "hale-mercury-462109-s4.firebasestorage.app",
  messagingSenderId: "648516703461",
  appId: "1:648516703461:web:2b5c21b927b87682f9700c",
  measurementId: "G-NSVSMTSZGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);