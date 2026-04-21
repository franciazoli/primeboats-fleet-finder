import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminFetchBoats, adminFetchInquiries } from "@/lib/api";
import { formatDate } from "@/data/inquiries";
import { Sailboat, Inbox, CheckCircle2, Clock } from "lucide-react";

const AdminDashboard = () => {
  const { data: boats = [] } = useQuery({ queryKey: ["admin", "boats"], queryFn: () => adminFetchBoats() });
  const { data: inquiries = [] } = useQuery({ queryKey: ["admin", "inquiries"], queryFn: () => adminFetchInquiries() });

  const available  = boats.filter((b) => b.status === "available").length;
  const newInq     = inquiries.filter((i) => i.status === "new").length;
  const recentInq  = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  const stats = [
    { label: "Total boats",   value: boats.length, icon: Sailboat,    link: "/admin/boats" },
    { label: "Available",     value: available,    icon: CheckCircle2, link: "/admin/boats" },
    { label: "New inquiries", value: newInq,        icon: Inbox,       link: "/admin/inquiries" },
    { label: "Total inquiries", value: inquiries.length, icon: Clock,  link: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-primary">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of your inventory and recent inquiries.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, link }) => (
          <Link key={label} to={link} className="rounded-lg border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-primary">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-primary">Recent inquiries</h2>
          <Link to="/admin/inquiries" className="text-sm text-accent hover:underline">View all →</Link>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {recentInq.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-semibold text-primary">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.boatName || "General inquiry"} · {formatDate(i.createdAt)}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${i.status === "new" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                {i.status}
              </span>
            </li>
          ))}
          {recentInq.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">No inquiries yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
