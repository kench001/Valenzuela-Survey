// create-admin-user.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2E9bJJpIUh-MEQhfVqwF1iFmBT75lPUw",
  authDomain: "valenzuela-survey-system.firebaseapp.com",
  projectId: "valenzuela-survey-system",
  storageBucket: "valenzuela-survey-system.firebasestorage.app", 
  messagingSenderId: "621843421978",
  appId: "1:621843421978:web:7ea63ebb2ece9fa214aaa3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    // Create the Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@valenzuela.gov.ph', 
      'ValenzuelaAdmin2025!'
    );
    
    console.log('✅ Firebase Auth user created:', userCredential.user.uid);
    
    // Create the admin document in Firestore
    await setDoc(doc(db, 'admins', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: 'admin@valenzuela.gov.ph',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      permissions: {
        createSurveys: true,
        deleteSurveys: true,
        viewAnalytics: true,
        manageUsers: true
      },
      createdAt: new Date(),
      lastLoginAt: null,
      isActive: true
    });
    
    console.log('✅ Admin document created in Firestore');
    console.log('🎉 Admin user setup complete!');
    console.log('📧 Email: admin@valenzuela.gov.ph');
    console.log('🔐 Password: ValenzuelaAdmin2025!');
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  User already exists, just updating Firestore document...');
      
      // Get the existing user's UID and update Firestore
      // Note: This is a simplified approach - in reality you'd need to get the UID differently
      console.log('Please manually sign in to get the UID and update the admin document');
    } else {
      console.error('❌ Error creating admin user:', error);
    }
  }
}

createAdminUser();