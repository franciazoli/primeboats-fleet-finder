import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Anchor, LayoutDashboard, Sailboat, Inbox, LogOut, ExternalLink } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/boats", label: "Boats", icon: Sailboat },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

export const AdminLayout = () => {
  const { logout, email } = useAdminAuth();
  const nav = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 md:flex-row">
      <aside className="border-b border-border bg-primary text-primary-foreground md:w-64 md:border-b-0 md:border-r">
        <div className="container flex items-center justify-between py-4 md:flex-col md:items-stretch md:gap-6 md:p-6">
          <Link to="/admin" className="flex items-center gap-2 font-display text-lg font-bold">
            <Anchor className="h-5 w-5 text-accent" /> PrimeBoats
            <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-[10px] uppercase text-accent-foreground">Admin</span>
          </Link>
          <nav className="flex gap-1 md:flex-col">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-foreground/10 text-accent"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto hidden flex-col gap-2 md:flex">
            <p className="truncate text-xs text-primary-foreground/60">{email}</p>
            <Link to="/" target="_blank" className="inline-flex items-center gap-1 text-xs text-primary-foreground/70 hover:text-accent">
              <ExternalLink className="h-3 w-3" /> View site
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); nav("/admin/login"); }}
              className="justify-start text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1">
        <div className="container py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};