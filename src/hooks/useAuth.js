import { useAuthContext } from '../context/AuthContext';

/**
 * Custom Hook untuk akses state & fungsi autentikasi
 */
export const useAuth = () => {
  return useAuthContext();
};

