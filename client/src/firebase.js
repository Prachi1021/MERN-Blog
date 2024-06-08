// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-f35f5.firebaseapp.com",
    projectId: "mern-blog-f35f5",
    storageBucket: "mern-blog-f35f5.appspot.com",
    messagingSenderId: "867355288550",
    appId: "1:867355288550:web:f91437427c8efeae5dec27"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);