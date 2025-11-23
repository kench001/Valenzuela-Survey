// admin-dashboard/src/services/firebaseService.ts
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

// Types
export interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'active' | 'closed';
  createdBy: string;
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
  closesAt?: any;
  settings?: {
    allowAnonymous: boolean;
    maxResponses?: number;
    requireLogin: boolean;
    allowMultipleResponses: boolean;
  };
  questions?: any[];
  demographics?: {
    collectAge: boolean;
    collectGender: boolean;
    collectBarangay: boolean;
    collectEducation: boolean;
  };
}

// Auth Service
export const authService = {
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (!adminDoc.exists() || !adminDoc.data().isActive) {
        await signOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    await signOut(auth);
  },

  onAuthChange(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

// Survey Service
export const surveyService = {
  async createSurvey(surveyData: any) {
    const docRef = await addDoc(collection(db, 'surveys'), {
      ...surveyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'draft',
      createdBy: auth.currentUser?.uid
    });
    return docRef.id;
  },

  async getSurveys(): Promise<Survey[]> {
    const q = query(collection(db, 'surveys'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Survey[];
  },

  async getSurvey(surveyId: string): Promise<Survey | null> {
    const docRef = doc(db, 'surveys', surveyId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { 
      id: snapshot.id, 
      ...snapshot.data() 
    } as Survey : null;
  },

  async updateSurvey(surveyId: string, updates: any) {
    const docRef = doc(db, 'surveys', surveyId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async deleteSurvey(surveyId: string) {
    const docRef = doc(db, 'surveys', surveyId);
    await deleteDoc(docRef);
  },

  async publishSurvey(surveyId: string) {
    await this.updateSurvey(surveyId, {
      status: 'active',
      publishedAt: serverTimestamp()
    });
  }
};

// Response Service
export const responseService = {
  async getSurveyResponses(surveyId: string) {
    const q = query(
      collection(db, 'responses'),
      where('surveyId', '==', surveyId),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};