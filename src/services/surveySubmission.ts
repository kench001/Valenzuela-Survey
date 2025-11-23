// src/services/surveySubmission.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const submitSurveyResponse = async (surveyId: string, responseData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'responses'), {
      surveyId,
      ...responseData,
      submittedAt: serverTimestamp(),
      isComplete: true,
      ipAddress: await getUserIP(), // Optional
      userAgent: navigator.userAgent
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};

// Helper function to get user IP (optional)
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}