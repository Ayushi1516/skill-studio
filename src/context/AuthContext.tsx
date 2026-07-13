import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { User } from '../types/interfaces';
import { authEvents } from "../services/auth-events";

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  /*  login and logout functions are re-declared on every render, creating a new object reference {{ currentUser, login, logout }}. 

    const login = (user: User) => { setCurrentUser(user); };
      const logout = () => {setCurrentUser(null);};
*/

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);
//To prevent unnecessary re-renders in components consuming this context, it is best practice to wrap the value object in useMemo and the functions in useCallback.

  // Listen for global logout events triggered by the API interceptor
  useEffect(() => {
    const handleLogout = () => {
      logout();
    };
    authEvents.addEventListener('logout', handleLogout);
    return () => authEvents.removeEventListener('logout', handleLogout);
  }, [logout]);

  const value = useMemo(() => ({ currentUser, login, logout }), [
    currentUser,
    login,
    logout,
  ]);

  return ( 
    <AuthContext.Provider value={value}>
      {children} {/* This represents all the components that are wrapped by <AuthProvider>. By rendering {children} inside the AuthContext.Provider tags, you ensure that every component in that tree has access to the value. */}
    </AuthContext.Provider>
  );
}

export function useAuth() { // custom hook to make accessing authentication state
  const context = useContext(AuthContext); //React automatically re-renders components that read some context if it changes
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}