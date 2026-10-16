import { useState } from 'react';
import { AuthUser } from '../types/auth';
import { getStoredAuthUser, clearAuthSession } from '../services/authService';

export function useAuthSession() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuthUser);

  const handleLoginSuccess = (user: AuthUser, _token: string) => {
    setAuthUser(user);
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthUser(null);
  };

  return {
    authUser,
    handleLoginSuccess,
    handleLogout,
  };
}
