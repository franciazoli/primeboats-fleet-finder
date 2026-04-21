import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Anchor } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/boats", label: "Boats" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-primary">
          <Anchor className="h-5 w-5 text-accent" />
          PrimeBoats
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            Admin
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-primary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-base font-medium",
                    isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm uppercase tracking-wider text-muted-foreground hover:bg-secondary"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};