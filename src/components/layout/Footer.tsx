import { Link, useLocation } from "react-router-dom";
import { Anchor, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <Anchor className="h-5 w-5 text-accent" /> PrimeBoats
          </div>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/70">
            Premium small boats, hand-picked across the Netherlands. We help you find the right
            vessel for canals, lakes and coastal cruising.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/boats" className="hover:text-accent">All boats</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-accent">Dealer login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-accent" /> Havenstraat 12, Amsterdam</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-accent" /> +31 20 123 4567</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-accent" /> info@primeboats.nl</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} PrimeBoats. All rights reserved.</p>
          <p>KvK 12345678 · BTW NL000000000B01</p>
        </div>
      </div>
    </footer>
  );
};