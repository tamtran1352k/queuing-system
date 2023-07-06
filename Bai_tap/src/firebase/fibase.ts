import { getFirestore, } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth"; ;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkMuhMB3G6ZgUB_-Df__mW29KJzIh97xw",
  authDomain: "fir-login-17926.firebaseapp.com",
  projectId: "fir-login-17926",
  storageBucket: "fir-login-17926.appspot.com",
  messagingSenderId: "506530984549",
  appId: "1:506530984549:web:25196550046dd4f93e4c8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const auth=getAuth(app);
 export const db = getFirestore(app);
 export const storage = getStorage(app);
 
 