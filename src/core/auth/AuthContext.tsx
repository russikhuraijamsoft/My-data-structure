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

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    let active = true;
    let revision = 0;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const requestRevision = ++revision;
      setUser(currentUser);
      setProfile(null);
      setLoading(true);
      try {
        const userProfile = currentUser
          ? await authService.getUserProfile(currentUser.uid)
          : null;
        if (!active || requestRevision !== revision) return;
        setProfile(userProfile);
        const branches = userProfile?.branches || [];
        if (!branches.includes(useAppStore.getState().branchId || '')) {
          setBranchId(branches.includes(userProfile?.defaultBranch || '') ? userProfile!.defaultBranch! : branches[0] || '');
        }
      } catch (error) {
        logger.warn('Failed to retrieve user profile', error);
      } finally {
        if (active && requestRevision === revision) setLoading(false);
      }
    });

    return () => { active = false; unsubscribe(); };
  }, [setBranchId]);

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
