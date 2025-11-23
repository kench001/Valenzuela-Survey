
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../Services/FirebaseService';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (user) => {
      if (user) {
        // Check if user is admin
        try {
          const response = await fetch('/api/check-admin', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          });
          const isAdmin = response.ok;
          
          setAuthState({
            user,
            loading: false,
            isAdmin
          });
        } catch (error) {
          setAuthState({
            user: null,
            loading: false,
            isAdmin: false
          });
        }
      } else {
        setAuthState({
          user: null,
          loading: false,
          isAdmin: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      await authService.login(email, password);
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
  };

  return {
    ...authState,
    login,
    logout
  };
};