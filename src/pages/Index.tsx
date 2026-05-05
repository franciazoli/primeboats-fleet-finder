import { Link } from "react-router-dom";
import { ArrowRight, Anchor, Shield, HeartHandshake, Sailboat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BoatCard } from "@/components/boats/BoatCard";
import { fetchBoats } from "@/lib/api";
import hero from "@/assets/hero-boat.jpg";

const Index = () => {
  const { data: featured = [] } = useQuery({
    queryKey: ["boats", "featured"],
    queryFn: () => fetchBoats({ featured: "1" }),
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Premium boat at sunset on Dutch waters" width={1920} height={1080} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="container relative flex min-h-[78vh] flex-col justify-center py-20 text-primary-foreground">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-widest backdrop-blur">
            <Anchor className="h-3.5 w-3.5 text-accent" /> Built for anglers
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Quality small boats, <span className="text-accent">ready to fish</span>.
          </h1>
          <p className="mt-6 max-w-xl text-base text-primary-foreground/85 md:text-lg">
            From open aluminium boats to sturdy sloops — PrimeBoats helps anglers find the
            perfect vessel and equip it exactly the way they need.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/boats">Browse boats <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">Featured</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">This week's highlights</h2>
            </div>
            <Link to="/boats" className="text-sm font-medium text-primary hover:text-accent">
              See all boats →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 3).map((boat) => <BoatCard key={boat.id} boat={boat} />)}
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="bg-secondary/40 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Why PrimeBoats</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">
              Everything an angler needs
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every boat in our inventory is personally inspected by our team. We also take care
              of the full fit-out — so you hit the water ready to fish from day one.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Shield, title: "Inspected & verified", text: "Every vessel passes a thorough inspection before listing — no hidden surprises." },
              { icon: Sailboat, title: "Angler-ready boats", text: "Sloops, aluminium boats and open hulls ideal for fishing on lakes, rivers and canals." },
              { icon: HeartHandshake, title: "Full custom fit-out", text: "We equip your boat with whatever you need — motor, canopy, rod holders, livewells and more." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-primary">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="overflow-hidden rounded-2xl bg-gradient-primary p-10 text-primary-foreground shadow-elegant md:p-16">
          <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Want a boat built your way?</h2>
              <p className="mt-3 max-w-xl text-primary-foreground/85">
                Tell us your ideal setup — we source the boat and fit it out with the engine, canopy,
                electronics or gear you need. Ready to fish, right out of the gate.
              </p>
            </div>
            <div className="md:text-right">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Send an inquiry <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
