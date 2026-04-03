'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Assuming standard endpoint to get own profile is auth/profile. Adjust if needed.
      const { data } = await api.get('/auth/profile');
      setUser(data);
    } catch (err) {
      console.error('Auth verification failed', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      setError(null);
      setIsLoading(true);
      const { data } = await api.post('/auth/login', credentials);
      
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      
      // If user is returned directly, use it, else fetch via checkAuth
      if (data.user) {
        setUser(data.user);
      } else {
        await checkAuth();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      setError(typeof msg === 'string' ? msg : msg[0]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      setIsLoading(true);
      await api.post('/auth/register', userData);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg || 'Registration failed.'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    // Let Next.js useRouter handle the redirect from the component where logout is called
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
