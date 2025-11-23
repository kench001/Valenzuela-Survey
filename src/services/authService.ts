// src/services/authService.ts
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User
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
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        ...adminDoc.data()
      } as AdminUser;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
      // Clear any stored user data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
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
            callback(user, adminData);
          } else {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          callback(null);
        }
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        callback(null);
      }
    });
  }

  // These methods are no longer needed since everything is integrated
  // Keeping them for backwards compatibility but they do nothing
  static navigateToLogin() {
    console.log('Navigation handled by App component');
  }

  static navigateToAdmin() {
    console.log('Navigation handled by App component');
  }

  static navigateToSurvey() {
    console.log('Navigation handled by App component');
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