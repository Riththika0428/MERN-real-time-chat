'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch, ApiError } from './api';
import { mapUser } from './adapters';
import type { ChatUser } from './types';

interface AuthContextValue {
  user: ChatUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = 'talknode-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }
    apiFetch<{ user: any }>('/api/auth/me', { token: stored })
      .then((res) => {
        setToken(stored);
        setUser(mapUser(res.user));
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    window.localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(mapUser(res.user));
  };

  const register = async (payload: { username: string; email: string; password: string }) => {
    const res = await apiFetch<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    window.localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(mapUser(res.user));
  };

  const logout = () => {
    if (token) {
      apiFetch('/api/auth/logout', { method: 'POST', token }).catch(() => {});
    }
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { ApiError };