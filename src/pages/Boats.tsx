import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BOAT_TYPES, BoatCondition, BoatType } from "@/data/boats";
import { BoatCard } from "@/components/boats/BoatCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { fetchBoats } from "@/lib/api";

type Sort = "newest" | "price-asc" | "price-desc";

const Boats = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<BoatType | "all">("all");
  const [condition, setCondition] = useState<BoatCondition | "all">("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allBoats = [], isLoading } = useQuery({
    queryKey: ["boats"],
    queryFn: () => fetchBoats(),
  });

  const filtered = useMemo(() => {
    let list = [...allBoats];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q));
    }
    if (type !== "all") list = list.filter((b) => b.type === type);
    if (condition !== "all") list = list.filter((b) => b.condition === condition);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "newest") list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    return list;
  }, [allBoats, search, type, condition, sort]);

  const reset = () => { setSearch(""); setType("all"); setCondition("all"); setSort("newest"); };

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Inventory</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">All boats</h1>
        <p className="mt-3 text-muted-foreground">Boats hand-picked for anglers — each one can be equipped with a motor, canopy, or any gear you need.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className={`${showFilters ? "grid" : "hidden"} mb-8 gap-4 rounded-lg border border-border bg-card p-4 md:grid md:grid-cols-4`}>
        <div>
          <Label className="mb-1.5 block text-xs">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as BoatType | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {BOAT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Condition</Label>
          <Select value={condition} onValueChange={(v) => setCondition(v as BoatCondition | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any condition</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Sort by</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest year</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="ghost" onClick={reset} className="w-full">Reset filters</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading boats...</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "boat" : "boats"} found</p>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-20 text-center text-muted-foreground">
              No boats match your filters.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((b) => <BoatCard key={b.id} boat={b} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Boats;
