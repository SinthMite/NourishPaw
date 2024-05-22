import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDuFYUp_U3OFSvqd5TuCBJoZie-DfLqeqM",
    authDomain: "nourishpaws-5464b.firebaseapp.com",
    projectId: "nourishpaws-5464b",
    storageBucket: "nourishpaws-5464b.appspot.com",
    messagingSenderId: "997764267425",
    appId: "1:997764267425:web:049e7263350faa23d69fe0",
    measurementId: "G-39MGHR24JE"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 