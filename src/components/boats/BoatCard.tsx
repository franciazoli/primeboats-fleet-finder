import { Link } from "react-router-dom";
import { Boat, formatPrice } from "@/data/boats";
import { Ruler, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  available: "bg-success text-success-foreground",
  reserved: "bg-accent text-accent-foreground",
  sold: "bg-destructive text-destructive-foreground",
};

export const BoatCard = ({ boat }: { boat: Boat }) => (
  <Link
    to={`/boats/${boat.slug}`}
    className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={boat.images[0]}
        alt={`${boat.name} — ${boat.type}`}
        loading="lazy"
        width={1280}
        height={896}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute left-3 top-3 flex gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", statusStyles[boat.status])}>
          {boat.status}
        </span>
        {boat.featured && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            Featured
          </span>
        )}
      </div>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-accent">{boat.type}</p>
      <h3 className="mt-1 font-display text-xl font-bold text-primary">{boat.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{boat.shortDescription}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" /> {boat.lengthMeters} m</span>
        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {boat.year}</span>
        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {boat.location}</span>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <span className="font-display text-2xl font-bold text-primary">{formatPrice(boat.price)}</span>
        <span className="text-xs font-medium text-accent group-hover:underline">View details →</span>
      </div>
    </div>
  </Link>
);