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
  // apiKey: "AIzaSyC9xuttm2j6WatFYNw5RBGx6nmUEziJQkY",
  // authDomain: "food-app-c3dc2.firebaseapp.com",
  // databaseURL: "https://food-app-c3dc2-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "food-app-c3dc2",
  // storageBucket: "food-app-c3dc2.firebasestorage.app",
  // messagingSenderId: "999034383061",
  // appId: "1:999034383061:web:40460e70b894348bcb105c"
    apiKey: "AIzaSyAZMum3Pw0ZhMF2bBQiS9vvoUkNw2G46JM",
  authDomain: "dany-tailor-59de1.firebaseapp.com",
  projectId: "dany-tailor-59de1",
  storageBucket: "dany-tailor-59de1.firebasestorage.app",
  messagingSenderId: "348872454887",
  appId: "1:348872454887:web:0491aba839a2ec6f2a6842",
  measurementId: "G-BJGT878FTK"
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
