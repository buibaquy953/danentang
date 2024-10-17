// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "adopt-pet-d1c88.firebaseapp.com",
  projectId: "adopt-pet-d1c88",
  storageBucket: "adopt-pet-d1c88.appspot.com",
  messagingSenderId: "1025178678813",
  appId: "1:1025178678813:web:fa63f9c5ad284ca974f8f4",
  measurementId: "G-6J5M41YM8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
export const storage =getStorage(app);