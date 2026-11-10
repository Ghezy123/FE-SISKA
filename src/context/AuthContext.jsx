import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { layananService } from '../services/layananService';
import { transaksiService } from '../services/transaksiService';

const AuthContext = createContext(null);

const triggerBackendSync = () => {
  Promise.allSettled([
    productService.syncFromBackend(),
    layananService.syncFromBackend(),
    transaksiService.syncFromBackend(),
  ]);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      const cachedUser = authService.getCurrentUser();
      if (cachedUser && mounted) {
        setUser(cachedUser);
      }

      const verifiedUser = await authService.verifySession();
      if (mounted) {
        setUser(verifiedUser);
        setLoading(false);
        if (verifiedUser) {
          triggerBackendSync();
        }
      }
    };

    initAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    triggerBackendSync();
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext harus digunakan di dalam AuthProvider');
  }
  return context;
};
