import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const KEY = "primeboats_admin_session";

interface AuthCtx {
  isAuthed: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

/**
 * MOCK admin auth (frontend-only). Wire to a real backend later.
 * Demo credentials: admin@primeboats.nl / primeboats
 */
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const v = sessionStorage.getItem(KEY);
    if (v) setEmail(v);
  }, []);

  const login = async (e: string, p: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (e.toLowerCase() === "admin@primeboats.nl" && p === "primeboats") {
      sessionStorage.setItem(KEY, e);
      setEmail(e);
      return { ok: true };
    }
    return { ok: false, error: "Invalid email or password" };
  };

  const logout = () => {
    sessionStorage.removeItem(KEY);
    setEmail(null);
  };

  return <Ctx.Provider value={{ isAuthed: !!email, email, login, logout }}>{children}</Ctx.Provider>;
};

export const useAdminAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return c;
};

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { isAuthed } = useAdminAuth();
  const loc = useLocation();
  if (!isAuthed) return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
  return <>{children}</>;
};