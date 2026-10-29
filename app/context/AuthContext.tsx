'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../components/PersonalAccount/PersonInfo';
import { apiRequest, logout as endSession } from '../config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User, returnTo?: string) => void;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
function saveSession(token: string, user: User) {
  if (localStorage.getItem('token') !== token) localStorage.setItem('token', token);
  const serializedUser = JSON.stringify(user);
  if (localStorage.getItem('user') !== serializedUser) localStorage.setItem('user', serializedUser);
  document.cookie = `token=${token}; path=/; max-age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
}
function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    let pendingToken: string | null = null;
    let lastCheckedToken: string | null = null;
    let lastCheckAt = 0;
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && pendingToken === token) return;
      try {
        const storedUser = localStorage.getItem('user');
        if (!token || !storedUser) {
          if (active) { setIsAuthenticated(false); setUser(null); }
          return;
        }
        let cachedUser: User;
        try {
          cachedUser = JSON.parse(storedUser);
          if (token.split('.').length !== 3 || !cachedUser?.id) throw new Error('Invalid stored session');
        } catch {
          clearSession();
          if (active) { setIsAuthenticated(false); setUser(null); }
          return;
        }
        if (token === lastCheckedToken && Date.now() - lastCheckAt < 60_000) {
          if (active) { setIsAuthenticated(true); setUser(cachedUser); }
          return;
        }
        pendingToken = token;
        try {
          const session = await apiRequest<{ token?: string; user: User }>('/api/auth/session');
          // A logout or a login in another tab must win over this pending request.
          if (!active || localStorage.getItem('token') !== token) return;
          saveSession(session.token || token, session.user);
          lastCheckedToken = session.token || token;
          lastCheckAt = Date.now();
          setIsAuthenticated(true); setUser(session.user);
        } catch (error) {
          if (!active || localStorage.getItem('token') !== token) return;
          if (error instanceof Error && error.message.startsWith('HTTP 401:')) {
            clearSession(); setIsAuthenticated(false); setUser(null);
          } else {
            // A temporary connection failure does not erase a persistent session.
            lastCheckedToken = token;
            lastCheckAt = Date.now();
            setIsAuthenticated(true); setUser(cachedUser);
          }
        } finally {
          if (pendingToken === token) pendingToken = null;
        }
      } finally { if (active) setIsLoading(false); }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user' || event.key === null) void initializeAuth();
    };
    const onFocus = () => { void initializeAuth(); };
    void initializeAuth();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => { active = false; window.removeEventListener('storage', onStorage); window.removeEventListener('focus', onFocus); };
  }, []);

  const login = (token: string, userData: User, returnTo?: string) => {
    saveSession(token, userData);
    setIsAuthenticated(true); setUser(userData);
    router.push(returnTo === '/test' ? '/test' : '/personalAccount');
  };
  const logout = () => {
    const token = localStorage.getItem('token');
    clearSession(); setIsAuthenticated(false); setUser(null);
    if (token) void endSession(token).catch(() => console.warn('Server logout could not be confirmed.'));
    router.push('/auth/login');
  };
  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
