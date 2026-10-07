import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Child, Role } from '../types';

interface AuthContextType {
  user: User | null;
  child: Child | null;
  role: Role | null;
  isLoading: boolean;
  loginAdmin: (username?: string, password?: string, demoMode?: boolean) => Promise<{ success: boolean; message?: string }>;
  loginChild: (childUsername?: string, demoMode?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshChildData: () => Promise<void>;
  updateChildPreferences: (updates: Partial<Child>) => Promise<void>;
  switchRole: (newRole: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored session or initialize with active child profile
  useEffect(() => {
    const savedRole = localStorage.getItem('learnable_auth_role') as Role | null;
    const savedChildId = localStorage.getItem('learnable_child_id');

    if (savedRole === 'administrator') {
      setUser({
        id: 'u-admin-1',
        name: 'Dr. Sarah Collins',
        username: 'admin@learnable.edu',
        role: 'administrator'
      });
      setRole('administrator');
      setIsLoading(false);
    } else if (savedRole === 'child' || !savedRole) {
      // Default to student profile (Leo)
      fetchChildProfile(savedChildId || 'c-1').then(childData => {
        if (childData) {
          setChild(childData);
          setUser({
            id: childData.userId,
            name: childData.displayName,
            username: 'leo',
            role: 'child'
          });
          setRole('child');
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchChildProfile = async (id: string): Promise<Child | null> => {
    try {
      const res = await fetch(`/api/children/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.child;
      }
    } catch (err) {
      console.warn("Failed to fetch child profile:", err);
    }
    return null;
  };

  const loginAdmin = async (username = 'admin@learnable.edu', password = '', demoMode = false) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'administrator', username, password, demoMode })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setRole('administrator');
        setChild(null);
        localStorage.setItem('learnable_auth_role', 'administrator');
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: data.message };
    } catch {
      setIsLoading(false);
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const loginChild = async (childUsername = 'leo', demoMode = false) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'child', username: childUsername, demoMode })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setChild(data.child);
        setRole('child');
        localStorage.setItem('learnable_auth_role', 'child');
        localStorage.setItem('learnable_child_id', data.child.id);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: data.message };
    } catch {
      setIsLoading(false);
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    setChild(null);
    setRole(null);
    localStorage.removeItem('learnable_auth_role');
  };

  const refreshChildData = async () => {
    if (!child) return;
    const updated = await fetchChildProfile(child.id);
    if (updated) {
      setChild(updated);
    }
  };

  const updateChildPreferences = async (updates: Partial<Child>) => {
    if (!child) return;
    try {
      const res = await fetch(`/api/children/${child.id}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setChild(data.child);
      }
    } catch (err) {
      console.warn("Failed to update preferences:", err);
    }
  };

  const switchRole = (newRole: Role) => {
    if (newRole === 'administrator') {
      loginAdmin('admin@learnable.edu', '', true);
    } else {
      loginChild('leo', true);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      child,
      role,
      isLoading,
      loginAdmin,
      loginChild,
      logout,
      refreshChildData,
      updateChildPreferences,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
