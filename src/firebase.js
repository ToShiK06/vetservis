import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCcJo3KAeeeAtaO0mM_lMwumRx8YBc7MBs",
  authDomain: "vetmaster-ce8c5.firebaseapp.com",
  projectId: "vetmaster-ce8c5",
  storageBucket: "vetmaster-ce8c5.firebasestorage.app",
  messagingSenderId: "1083931774052",
  appId: "1:1083931774052:web:d5bc6b1902c48f5b5aa371",
  measurementId: "G-KKM80BQYEJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const petsCollection = collection(db, 'pets');
export const requestsCollection = collection(db, 'requests');
export const appointmentsCollection = collection(db, 'appointments');
export const servicesCollection = collection(db, 'services');

export { addDoc, getDocs, deleteDoc, doc, signInWithEmailAndPassword, query, where, getDoc, updateDoc };