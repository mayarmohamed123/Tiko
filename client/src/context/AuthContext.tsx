import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '../services';
import { AuthContext, type User } from './AuthContextInstance';
import { tokenStore } from '../api/axios';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser({
        id: me.id,
        fullName: me.fullName,
        email: me.email,
        role: me.role,
        avatarUrl: me.avatarUrl,
      });
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      await refreshUser();
      if (!cancelled) setIsLoading(false);
    };
    init();
    return () => { cancelled = true; };
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });

    // Store token in memory so Safari can send it as Bearer on future requests.
    // Chrome/Firefox use the httpOnly cookie automatically (preferred).
    if (result.token) {
      tokenStore.set(result.token);
    }

    setUser({
      id: result.user.id,
      fullName: result.user.fullName,
      email: result.user.email,
      role: result.user.role,
      avatarUrl: result.user.avatarUrl,
    });

    return result;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      tokenStore.clear(); // Clear in-memory token on logout
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
