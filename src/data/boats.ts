export type BoatStatus = "available" | "reserved" | "sold";
export type BoatCondition = "new" | "used";
export type BoatType = "Sloop" | "Sport" | "Cabin Cruiser" | "RIB" | "Center Console" | "Tender";

export interface Boat {
  id: string;
  slug: string;
  name: string;
  type: BoatType;
  price: number;
  lengthMeters: number | null;
  year: number | null;
  engine: string;
  condition: BoatCondition;
  status: BoatStatus;
  featured: boolean;
  shortDescription: string;
  description: string;
  images: string[];
  location: string;
}

export const BOAT_TYPES: BoatType[] = ["Sloop", "Sport", "Cabin Cruiser", "RIB", "Center Console", "Tender"];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);
