import { useMemo, useState } from "react";
import { Inquiry, InquiryStatus, MOCK_INQUIRIES, formatDate } from "@/data/inquiries";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Mail, Phone, Sailboat, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-success/15 text-success",
  contacted: "bg-accent/20 text-accent-foreground",
  archived: "bg-muted text-muted-foreground",
};

const AdminInquiries = () => {
  const [list, setList] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [view, setView] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const sorted = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return filter === "all" ? sorted : sorted.filter((i) => i.status === filter);
  }, [list, filter]);

  const setStatus = (id: string, status: InquiryStatus) => {
    setList(list.map((i) => (i.id === id ? { ...i, status } : i)));
    if (view?.id === id) setView({ ...view, status });
    toast({ title: `Marked as ${status}` });
  };

  const remove = () => {
    if (!deleteId) return;
    setList(list.filter((i) => i.id !== deleteId));
    toast({ title: "Inquiry deleted" });
    setDeleteId(null);
    if (view?.id === deleteId) setView(null);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-primary">Inquiries</h1>
      <p className="mt-1 text-muted-foreground">{list.length} total · manage customer messages</p>

      <div className="mt-6 max-w-xs">
        <Select value={filter} onValueChange={(v) => setFilter(v as InquiryStatus | "all")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All inquiries</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ul className="mt-6 space-y-3">
        {filtered.map((i) => (
          <li key={i.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-primary">{i.name}</h3>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs capitalize", statusStyles[i.status])}>{i.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(i.createdAt)}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {i.email}</span>
                  {i.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {i.phone}</span>}
                  {i.boatName && <span className="inline-flex items-center gap-1"><Sailboat className="h-3 w-3" /> {i.boatName}</span>}
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{i.message}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => setView(i)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
            No inquiries match the current filter.
          </li>
        )}
      </ul>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-lg">
          {view && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{view.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">{formatDate(view.createdAt)}</p>
                <div className="grid gap-2 rounded-md bg-secondary/50 p-3">
                  <p><span className="text-muted-foreground">Email:</span> <a href={`mailto:${view.email}`} className="text-accent hover:underline">{view.email}</a></p>
                  {view.phone && <p><span className="text-muted-foreground">Phone:</span> {view.phone}</p>}
                  {view.boatName && <p><span className="text-muted-foreground">Boat:</span> {view.boatName}</p>}
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</p>
                  <p className="whitespace-pre-line rounded-md border border-border bg-background p-3 text-sm">{view.message}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setStatus(view.id, "new")} disabled={view.status === "new"}>Mark new</Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(view.id, "contacted")} disabled={view.status === "contacted"}>Mark contacted</Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(view.id, "archived")} disabled={view.status === "archived"}>Archive</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminInquiries;