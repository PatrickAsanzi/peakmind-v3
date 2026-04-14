import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { login } from "../api/login";
import { logout as apiLogout } from "../api/logout";
import { fetchProfile } from "../api/fetchProfile";
import type { AuthUserProfile } from "../types";

interface AuthContextValue {
  user: AuthUserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUserProfile>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("pm_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        setUser(profile);
      } catch {
        apiLogout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn: async (email: string, password: string) => {
        const payload = await login({ email, password });
        localStorage.setItem("pm_token", payload.token);
        const profile = await fetchProfile();
        setUser(profile);
        return profile;
      },
      signOut: () => {
        apiLogout();
        setUser(null);
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
