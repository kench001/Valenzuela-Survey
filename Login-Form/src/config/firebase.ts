// Login-Form/src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD2E9bJJpIUh-MEQhfVqwF1iFmBT75lPUw",
  authDomain: "valenzuela-survey-system.firebaseapp.com",
  projectId: "valenzuela-survey-system",
  storageBucket: "valenzuela-survey-system.firebasestorage.app", 
  messagingSenderId: "621843421978",
  appId: "1:621843421978:web:7ea63ebb2ece9fa214aaa3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;