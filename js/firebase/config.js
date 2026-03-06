import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js"
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyA4iW1CD1tHK0bzWoELUQZKbD6arMDVFo0",
  authDomain: "natustore-7ef33.firebaseapp.com",
  projectId: "natustore-7ef33",
  storageBucket: "natustore-7ef33.firebasestorage.app",
  messagingSenderId: "278725673508",
  appId: "1:278725673508:web:3c583a4bb5e4aa4a07ceb1"
}

const app = initializeApp(firebaseConfig)
export { app, getFirestore, getDoc, setDoc, doc, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
