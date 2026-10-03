import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { logger } from '../logging/logger';
import { authService, UserProfile } from '../../features/auth/services/authService';
import { useAppStore } from '../store/appStore';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const setBranchId = useAppStore(state => state.setBranchId);
  const currentBranchId = useAppStore(state => state.branchId);

  useEffect(() => {
    if (!auth) {
      // Demo fallback so the user can immediately experience the ERP interface
      const demoUser = {
        uid: 'demo_owner_1',
        email: 'russi.khuraijam@gmail.com',
        displayName: 'Russi Khuraijam',
      };
      setUser(demoUser);
      setProfile({
        uid: demoUser.uid,
        email: demoUser.email,
        phoneNumber: '+919876543210',
        displayName: demoUser.displayName,
        roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN', 'INVENTORY', 'HR', 'ACCOUNTANT'],
        permissions: ['*'],
        branches: ['Downtown Main'],
        defaultBranch: 'Downtown Main',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProfile = await authService.getUserProfile(currentUser.uid);
          if (userProfile) {
            setProfile(userProfile);
            if (userProfile.defaultBranch && !currentBranchId) {
              setBranchId(userProfile.defaultBranch);
            }
          } else {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              phoneNumber: currentUser.phoneNumber,
              displayName: currentUser.displayName || 'Authenticated User',
              roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN', 'INVENTORY', 'HR', 'ACCOUNTANT'],
              permissions: ['*'],
              branches: ['Downtown Main'],
              createdAt: new Date().toISOString()
            });
          }
          logger.info('User authenticated', { uid: currentUser.uid });
        } catch (error) {
          logger.warn('Failed to retrieve user profile, using fallback profile', error);
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            displayName: currentUser.displayName || 'Authenticated User',
            roles: ['OWNER', 'ADMIN', 'MANAGER'],
            permissions: ['*'],
            branches: ['Downtown Main'],
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // Provide mock user session for dev exploration if not logged in
        setProfile({
          uid: 'demo_owner_1',
          email: 'russi.khuraijam@gmail.com',
          phoneNumber: '+919876543210',
          displayName: 'Russi Khuraijam',
          roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN', 'INVENTORY', 'HR', 'ACCOUNTANT'],
          permissions: ['*'],
          branches: ['Downtown Main'],
          defaultBranch: 'Downtown Main',
          createdAt: new Date().toISOString()
        });
        setUser({
          uid: 'demo_owner_1',
          email: 'russi.khuraijam@gmail.com',
          displayName: 'Russi Khuraijam',
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setBranchId, currentBranchId]);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setProfile(null);
  };

  const hasRole = (role: string): boolean => {
    return profile?.roles?.includes(role) || profile?.roles?.includes('OWNER') || false;
  };

  const hasPermission = (permission: string): boolean => {
    return profile?.permissions?.includes(permission) || profile?.permissions?.includes('*') || false;
  };

  const value = {
    user,
    profile,
    loading,
    logout,
    hasRole,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
