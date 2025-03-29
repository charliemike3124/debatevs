import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDgK4BHwzdLrw6mldeAo-Q47B_G1jOMoA4',
    authDomain: 'debate-versus.firebaseapp.com',
    projectId: 'debate-versus',
    storageBucket: 'debate-versus.firebasestorage.app',
    messagingSenderId: '619542509323',
    appId: '1:619542509323:web:45983401c0d2663240140e',
    measurementId: 'G-SFSCPQNHLK',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
