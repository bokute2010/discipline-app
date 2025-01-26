// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC6NIR6CmvhJlIHXqzrDb3ZTsAigJtDQg",
  authDomain: "master-discipline.firebaseapp.com",
  projectId: "master-discipline",
  storageBucket: "master-discipline.firebasestorage.app",
  messagingSenderId: "102939804398",
  appId: "1:102939804398:web:5ff381ee1dc9570c7929ff",
  measurementId: "G-HJS3Y6FFG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);