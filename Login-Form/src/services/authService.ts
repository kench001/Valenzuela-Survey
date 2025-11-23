// Login-Form/src/services/authService.ts
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface AdminUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export class AuthService {
  // Login with email and password
  static async login(email: string, password: string): Promise<AdminUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (!adminDoc.exists() || !adminDoc.data().isActive) {
        await signOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }
      
      const adminData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        ...adminDoc.data()
      } as AdminUser;

      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', adminData.role);
      localStorage.setItem('userEmail', adminData.email);
      
      return adminData;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
      // Clear stored user data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  // Get current user role
  static getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Get current user email
  static getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Navigate to admin dashboard after successful login
  static navigateToAdmin(): void {
    // Navigate to your Admin-Dashboard application
    const adminUrl = 'http://localhost:3001';
    window.location.href = adminUrl;
  }

  // Navigate back to survey
  static navigateToSurvey(): void {
    const surveyUrl = 'http://localhost:5174/Valenzuela-Survey';
    window.location.href = surveyUrl;
  }

  // Listen for auth state changes
  static onAuthStateChange(callback: (user: User | null, adminData?: AdminUser) => void) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists() && adminDoc.data().isActive) {
            const adminData = {
              uid: user.uid,
              email: user.email || '',
              ...adminDoc.data()
            } as AdminUser;
            
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', adminData.role);
            localStorage.setItem('userEmail', adminData.email);
            callback(user, adminData);
          } else {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          callback(null);
        }
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        callback(null);
      }
    });
  }
}

export default AuthService;