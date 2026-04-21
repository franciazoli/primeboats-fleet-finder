import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Anchor, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const { login, isAuthed } = useAdminAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string })?.from || "/admin";

  const [email, setEmail] = useState("admin@primeboats.nl");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAuthed) {
    nav(from, { replace: true });
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await login(email, password);
    setBusy(false);
    if (res.ok) nav(from, { replace: true });
    else setError(res.error || "Login failed");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-elegant">
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-xl font-bold text-primary">
          <Anchor className="h-5 w-5 text-accent" /> PrimeBoats
        </Link>
        <h1 className="mt-6 text-center font-display text-2xl font-bold text-primary">Admin sign in</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Demo credentials: <code className="rounded bg-muted px-1 text-xs">admin@primeboats.nl</code> / <code className="rounded bg-muted px-1 text-xs">primeboats</code>
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full bg-primary hover:bg-primary/90">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">
          ← Back to website
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;