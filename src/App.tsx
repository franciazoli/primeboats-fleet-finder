import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Boats from "./pages/Boats.tsx";
import BoatDetail from "./pages/BoatDetail.tsx";
import Contact from "./pages/Contact.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminBoats from "./pages/admin/AdminBoats.tsx";
import AdminInquiries from "./pages/admin/AdminInquiries.tsx";
import { AdminLayout } from "./components/admin/AdminLayout.tsx";
import { AdminAuthProvider, RequireAdmin } from "./lib/admin-auth.tsx";
import { Header } from "./components/layout/Header.tsx";
import { Footer } from "./components/layout/Footer.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/boats" element={<Boats />} />
                <Route path="/boats/:slug" element={<BoatDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="boats" element={<AdminBoats />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
