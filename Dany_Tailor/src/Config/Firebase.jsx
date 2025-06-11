import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  where,
  query,
  enableIndexedDbPersistence, // ⬅️ Add this line
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  set,
  update,
  remove,
  onValue,
  get,
  child,
 
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBToEkvxspqEQl4qBKu4OTJ8BcU_iqfWrw",
  authDomain: "login-form-34572.firebaseapp.com",
  databaseURL: "https://login-form-34572-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "login-form-34572",
  storageBucket: "login-form-34572.firebasestorage.app",
  messagingSenderId: "47566707376",
  appId: "1:47566707376:web:ab1abd7f8afcabef5bb975"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// ✅ Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error("Persistence can only be enabled in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    console.error("Offline persistence is not supported in this browser.");
  }
});





export {
  auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  db,
  getDoc,
  getDocs,
  ref,
  set,
  database,
  collection,
  addDoc,
  update,
  remove,
  onValue,
  get,
  child,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  query,
  where,
};
