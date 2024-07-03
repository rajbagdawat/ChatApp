
// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdrlr9Z2kyq6gT84rzL5FF8PSyqTf5dZ4",
  authDomain: "chatapp-6859c.firebaseapp.com",
  projectId: "chatapp-6859c",
  storageBucket: "chatapp-6859c.appspot.com",
  messagingSenderId: "399286234023",
  appId: "1:399286234023:web:127b39ae524d01a35ca482",
  measurementId: "G-ZSDGHSK0W5D"
};
const app = initializeApp(firebaseConfig);

export const authfirebase = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)        
});

export const auth = getAuth(app);
export const db = getFirestore(app);
