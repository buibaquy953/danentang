// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBi1BwpAJbrXlRp6Nmiu5j6ky8OZV8xCb4",
  authDomain: "adoptappreactnative.firebaseapp.com",
  projectId: "adoptappreactnative",
  storageBucket: "adoptappreactnative.appspot.com",
  messagingSenderId: "337277303035",
  appId: "1:337277303035:web:6ea184f3e93cfe2ff2185e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
export const storage =getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();