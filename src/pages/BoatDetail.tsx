import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBoat, fetchBoats } from "@/lib/api";
import { formatPrice } from "@/data/boats";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InquiryForm } from "@/components/InquiryForm";
import { BoatCard } from "@/components/boats/BoatCard";
import { ArrowLeft, Calendar, MapPin, Ruler, Cog, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  available: "bg-success text-success-foreground",
  reserved: "bg-accent text-accent-foreground",
  sold: "bg-destructive text-destructive-foreground",
};

const BoatDetail = () => {
  const { slug } = useParams();
  const [activeImg, setActiveImg] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const { data: boat, isLoading, isError } = useQuery({
    queryKey: ["boat", slug],
    queryFn: () => fetchBoat(slug!),
    enabled: !!slug,
  });

  const { data: allBoats = [] } = useQuery({
    queryKey: ["boats"],
    queryFn: () => fetchBoats(),
    enabled: !!boat,
  });

  const related = boat
    ? allBoats.filter((b) => b.id !== boat.id && b.type === boat.type).slice(0, 3)
    : [];

  if (isLoading) {
    return <div className="container py-32 text-center text-muted-foreground">Loading...</div>;
  }

  if (isError || !boat) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Boat not found</h1>
        <Link to="/boats" className="mt-4 inline-block text-accent">← Back to all boats</Link>
      </div>
    );
  }

  const images = boat.images.length > 0 ? boat.images : ["/placeholder.svg"];

  return (
    <div className="container py-8 md:py-12">
      <Link to="/boats" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All boats
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted shadow-card">
            <img
              src={images[activeImg]}
              alt={`${boat.name} photo ${activeImg + 1}`}
              width={1280}
              height={896}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 flex gap-2">
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold capitalize", statusStyles[boat.status])}>
                {boat.status}
              </span>
              {boat.featured && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Featured</span>
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "aspect-[4/3] overflow-hidden rounded-md border-2 transition-all",
                    activeImg === i ? "border-accent" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">{boat.type}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">{boat.name}</h1>
          <p className="mt-3 font-display text-3xl font-bold text-primary">{formatPrice(boat.price)}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 text-sm">
            {boat.lengthMeters && <div className="flex items-center gap-2"><Ruler className="h-4 w-4 text-accent" /> {boat.lengthMeters} m</div>}
            {boat.year && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> {boat.year}</div>}
            {boat.engine && <div className="flex items-center gap-2"><Cog className="h-4 w-4 text-accent" /> {boat.engine}</div>}
            {boat.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {boat.location}</div>}
            <div className="flex items-center gap-2 capitalize"><Sparkles className="h-4 w-4 text-accent" /> {boat.condition}</div>
          </div>

          <Button
            size="lg"
            onClick={() => setInquiryOpen(true)}
            disabled={boat.status === "sold"}
            className="mt-6 w-full bg-primary hover:bg-primary/90"
          >
            {boat.status === "sold" ? "Sold" : `Inquire about this ${boat.type.toLowerCase()}`}
          </Button>
        </div>
      </div>

      {boat.description && (
        <div className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-primary">Description</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{boat.description}</p>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold text-primary">Similar boats</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((b) => <BoatCard key={b.id} boat={b} />)}
          </div>
        </div>
      )}

      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Inquire about {boat.name}</DialogTitle>
          </DialogHeader>
          <InquiryForm boat={boat} onSubmitted={() => setInquiryOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoatDetail;
