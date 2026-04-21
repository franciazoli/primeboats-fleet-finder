export type InquiryStatus = "new" | "contacted" | "archived";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  boatName?: string;
  status: InquiryStatus;
  createdAt: string;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
