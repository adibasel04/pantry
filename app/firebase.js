// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9UstqQpGUJnjkJuAlXN9DGqQvcKk1eg0",
  authDomain: "pantry-257a8.firebaseapp.com",
  projectId: "pantry-257a8",
  storageBucket: "pantry-257a8.appspot.com",
  messagingSenderId: "686627087632",
  appId: "1:686627087632:web:4a51b26f0f22cd6a3bf195",
  measurementId: "G-G27G86HYH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};