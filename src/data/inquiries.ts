import { Boat } from "./boats";

export type InquiryStatus = "new" | "contacted" | "archived";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  boatSlug?: string;
  boatName?: string;
  status: InquiryStatus;
  createdAt: string;
}

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "i1",
    name: "Lars de Vries",
    email: "lars@example.nl",
    phone: "+31 6 12345678",
    message: "Is the Azure Sport 310 still available for a viewing this weekend?",
    boatSlug: "azure-sport-310",
    boatName: "Azure Sport 310",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "i2",
    name: "Sophie Janssen",
    email: "sophie.j@example.com",
    message: "Looking for an electric sloop under €50k for the Amsterdam canals.",
    status: "contacted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "i3",
    name: "Mark Bakker",
    email: "m.bakker@example.nl",
    phone: "+31 6 87654321",
    message: "Could you send service history for the Klassiek Sloop 720?",
    boatSlug: "klassiek-sloop-720",
    boatName: "Klassiek Sloop 720",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const buildBoatRef = (boat?: Boat) =>
  boat ? { boatSlug: boat.slug, boatName: boat.name } : {};