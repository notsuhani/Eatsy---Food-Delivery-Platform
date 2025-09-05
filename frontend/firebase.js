// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "eatsy-food-delivery.firebaseapp.com",
  projectId: "eatsy-food-delivery",
  storageBucket: "eatsy-food-delivery.firebasestorage.app",
  messagingSenderId: "81411138090",
  appId: "1:81411138090:web:ca06f2b562fdcbf9c81953"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app,auth} 