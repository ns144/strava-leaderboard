// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApRQ_xjhZAWwOwZ32NiTjBy5SM6f0PVuM",
  authDomain: "strava-leaderboard-e7636.firebaseapp.com",
  projectId: "strava-leaderboard-e7636",
  storageBucket: "strava-leaderboard-e7636.firebasestorage.app",
  messagingSenderId: "895891991050",
  appId: "1:895891991050:web:307d7bad887a575aa68df3",
  measurementId: "G-FXS3MN13Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);