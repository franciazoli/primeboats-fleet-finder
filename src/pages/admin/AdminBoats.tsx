import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Boat, formatPrice, BOAT_TYPES } from "@/data/boats";
import { adminFetchBoats, adminCreateBoat, adminUpdateBoat, adminDeleteBoat, adminUploadImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, Search, Upload, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Form = Omit<Boat, "id">;

const empty: Form = {
  slug: "",
  name: "",
  type: "Sloop",
  price: 0,
  lengthMeters: null,
  year: null,
  engine: "",
  condition: "used",
  status: "available",
  featured: false,
  shortDescription: "",
  description: "",
  location: "",
  images: [],
};

const AdminBoats = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Boat | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: boats = [], isLoading } = useQuery({
    queryKey: ["admin", "boats"],
    queryFn: () => adminFetchBoats(),
  });

  const filtered = useMemo(
    () => boats.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [boats, search],
  );

  const createMut = useMutation({
    mutationFn: adminCreateBoat,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "boats"] }); toast({ title: "Boat created" }); setOpen(false); },
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const updateMut = useMutation({
    mutationFn: adminUpdateBoat,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "boats"] }); toast({ title: "Boat updated" }); setOpen(false); },
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: adminDeleteBoat,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "boats"] }); toast({ title: "Boat deleted" }); setDeleteId(null); },
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const uploadMut = useMutation({
    mutationFn: adminUploadImage,
    onSuccess: (d) => setForm((f) => ({ ...f, images: [...f.images, d.url] })),
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const startEdit   = (b: Boat) => { setEditing(b); setForm({ ...b }); setOpen(true); };

  const save = () => {
    if (!form.name || !form.slug) {
      toast({ title: "Name and slug are required", variant: "destructive" });
      return;
    }
    if (editing) {
      updateMut.mutate({ ...form, id: editing.id });
    } else {
      createMut.mutate(form);
    }
  };

  const removeImage = (url: string) =>
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));

  const isSaving = createMut.isPending || updateMut.isPending;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Boats</h1>
          <p className="mt-1 text-muted-foreground">{boats.length} total · manage your inventory</p>
        </div>
        <Button onClick={startCreate} className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4" /> New boat</Button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search boats..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium text-primary">{b.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{b.type}</TableCell>
                  <TableCell>{formatPrice(b.price)}</TableCell>
                  <TableCell className="hidden capitalize sm:table-cell">{b.status}</TableCell>
                  <TableCell className="hidden lg:table-cell">{b.featured ? "Yes" : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No boats found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing ? "Edit boat" : "New boat"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Slug (URL)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="azure-sport-310" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Boat["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BOAT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price (€)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
            </div>
            <div>
              <Label>Length (m)</Label>
              <Input type="number" step="0.1" value={form.lengthMeters ?? ""} onChange={(e) => setForm({ ...form, lengthMeters: e.target.value ? +e.target.value : null })} />
            </div>
            <div>
              <Label>Year</Label>
              <Input type="number" value={form.year ?? ""} onChange={(e) => setForm({ ...form, year: e.target.value ? +e.target.value : null })} />
            </div>
            <div>
              <Label>Engine</Label>
              <Input value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v as Boat["condition"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Boat["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label htmlFor="featured" className="cursor-pointer">Featured on homepage</Label>
                <p className="text-xs text-muted-foreground">Show this boat in the featured section.</p>
              </div>
              <Switch id="featured" checked={form.featured} onCheckedChange={(c) => setForm({ ...form, featured: c })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Short description</Label>
              <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} maxLength={500} />
            </div>
            <div className="sm:col-span-2">
              <Label>Full description</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Images</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {form.images.map((url) => (
                  <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-md border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute right-0.5 top-0.5 hidden rounded-full bg-destructive p-0.5 text-white group-hover:flex"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadMut.isPending}
                  className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  {uploadMut.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMut.mutate(f); e.target.value = ""; }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={isSaving} className="bg-primary hover:bg-primary/90">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Save changes" : "Create boat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this boat?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
              disabled={deleteMut.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBoats;
