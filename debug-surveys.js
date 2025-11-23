import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPjAO6tSEpQI5Jm3l8zRYjVcGCKo7FjJ8",
  authDomain: "valenzuela-survey-system.firebaseapp.com",
  projectId: "valenzuela-survey-system",
  storageBucket: "valenzuela-survey-system.firebasestorage.app",
  messagingSenderId: "1057493162228",
  appId: "1:1057493162228:web:8c9e1b3f7e5d4a2c3f9g1h"
};

async function checkSurveys() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('Fetching all surveys...');
    const allSurveysSnapshot = await getDocs(collection(db, 'surveys'));
    console.log('Total surveys:', allSurveysSnapshot.size);

    allSurveysSnapshot.forEach(doc => {
      const data = doc.data();
      console.log('Survey:', {
        id: doc.id,
        title: data.title,
        status: data.status,
        createdAt: data.createdAt,
        questionCount: data.questions?.length || 0
      });
    });

    console.log('\nFetching active surveys...');
    const activeQuery = query(collection(db, 'surveys'), where('status', '==', 'active'));
    const activeSnapshot = await getDocs(activeQuery);
    console.log('Active surveys:', activeSnapshot.size);

    activeSnapshot.forEach(doc => {
      const data = doc.data();
      console.log('Active survey:', {
        id: doc.id,
        title: data.title,
        status: data.status,
        questionCount: data.questions?.length || 0
      });
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSurveys();