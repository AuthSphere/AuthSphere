import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  getUser,
  ensureAuthenticated,
  logout as sdkLogout,
} from "../client/session";
import type { AuthUser } from "../types";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthSphereProviderProps {
  children: ReactNode;
}

export const AuthSphereProvider: React.FC<AuthSphereProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const isValid = await ensureAuthenticated();
      setIsAuthenticated(isValid);
      if (isValid) {
        setUser(getUser());
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to verify session"));
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await sdkLogout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
