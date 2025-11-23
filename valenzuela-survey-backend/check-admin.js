// check-admin.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2E9bJJpIUh-MEQhfVqwF1iFmBT75lPUw",
  authDomain: "valenzuela-survey-system.firebaseapp.com",
  projectId: "valenzuela-survey-system",
  storageBucket: "valenzuela-survey-system.firebasestorage.app", 
  messagingSenderId: "621843421978",
  appId: "1:621843421978:web:7ea63ebb2ece9fa214aaa3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAdmins() {
  try {
    const querySnapshot = await getDocs(collection(db, 'admins'));
    
    console.log('👥 Admin documents found:');
    querySnapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Data:', doc.data());
      console.log('---');
    });
    
    if (querySnapshot.empty) {
      console.log('❌ No admin documents found!');
    }
    
  } catch (error) {
    console.error('❌ Error checking admins:', error);
  }
}

checkAdmins();