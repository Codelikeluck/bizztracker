import { createContext, useContext, useState, useEffect } from 'react';
import { security } from '../utils/security';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPinSetup, setIsPinSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsPinSetup(security.isPinSetup());
    setIsAuthenticated(security.isLoggedIn());
    setLoading(false);
  }, []);

  const setupPin = async (pin) => {
    await security.setupPin(pin);
    setIsPinSetup(true);
    const result = await security.login(pin);
    setIsAuthenticated(result.success);
    return result;
  };

  const login = async (pin) => {
    const result = await security.login(pin);
    setIsAuthenticated(result.success);
    return result;
  };

  const logout = () => {
    security.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isPinSetup, setupPin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
