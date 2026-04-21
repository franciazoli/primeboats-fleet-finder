import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { adminLogin, adminLogout, adminMe } from "@/lib/api";

interface AuthCtx {
  isAuthed: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    adminMe()
      .then((d) => setUsername(d.username))
      .catch(() => setUsername(null))
      .finally(() => setChecked(true));
  }, []);

  const login = async (u: string, p: string) => {
    try {
      const d = await adminLogin(u, p);
      setUsername(d.username);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Login failed" };
    }
  };

  const logout = async () => {
    await adminLogout().catch(() => {});
    setUsername(null);
  };

  if (!checked) return null;

  return (
    <Ctx.Provider value={{ isAuthed: !!username, username, login, logout }}>
      {children}
    </Ctx.Provider>
  );
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
