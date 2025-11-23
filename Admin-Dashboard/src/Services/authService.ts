// Admin-Dashboard/src/services/authService.ts
import { 
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

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
      // Clear stored user data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      
      // Navigate to survey form
      AuthService.navigateToSurvey();
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Navigate to login
  static navigateToLogin(): void {
    const loginUrl = 'http://localhost:3000';
    window.location.href = loginUrl;
  }

  // Navigate to survey
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

  // Get current admin user data
  static async getCurrentUser(): Promise<AdminUser | null> {
    if (!this.isAuthenticated()) return null;

    try {
      const user = auth.currentUser;
      if (!user) return null;

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists() && adminDoc.data().isActive) {
        return {
          uid: user.uid,
          email: user.email || '',
          ...adminDoc.data()
        } as AdminUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
}

export default AuthService;