// create-admin.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD2E9bJJpIUh-MEQhfVqwF1iFmBT75lPUw",
  authDomain: "valenzuela-survey-system.firebaseapp.com", 
  projectId: "valenzuela-survey-system",
  storageBucket: "valenzuela-survey-system.firebasestorage.app",
  messagingSenderId: "621843421978",
  appId: "1:621843421978:web:7ea63ebb2ece9fa214aaa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    console.log('🔄 Creating admin user...');
    
    let userCredential;
    const email = 'admin@valenzuela.gov.ph';
    const password = 'ValenzuelaAdmin2025!';
    
    try {
      // Try to create new user
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase Auth user created with UID:', userCredential.user.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('📧 User already exists, signing in...');
        // User exists, sign in instead
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Signed in with existing user UID:', userCredential.user.uid);
      } else {
        throw error;
      }
    }
    
    // Add admin document to Firestore
    await setDoc(doc(db, 'admins', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'super_admin',
      permissions: {
        createSurveys: true,
        deleteSurveys: true,
        viewAnalytics: true,
        manageUsers: true
      },
      createdAt: serverTimestamp(),
      lastLoginAt: null,
      isActive: true
    });
    
    console.log('✅ Admin document created in Firestore');
    console.log('🎉 Admin user setup complete!');
    console.log('📧 Email: admin@valenzuela.gov.ph');
    console.log('🔑 Password: ValenzuelaAdmin2025!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();