import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, increment, deleteDoc, collection, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // This is the Firestore instance
const storage = getStorage(app);

// Exporting instances and functions
export { 
  auth, 
  db, // Export the Firestore instance as 'db'
  signOut, 
  storage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  collection, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  increment, 
  deleteDoc, 
  query, 
  where,
  onAuthStateChanged,
  addDoc
};
