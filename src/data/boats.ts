import boat1 from "@/assets/boat-1.jpg";
import boat2 from "@/assets/boat-2.jpg";
import boat3 from "@/assets/boat-3.jpg";
import boat4 from "@/assets/boat-4.jpg";
import boat5 from "@/assets/boat-5.jpg";
import boat6 from "@/assets/boat-6.jpg";

export type BoatStatus = "available" | "reserved" | "sold";
export type BoatCondition = "new" | "used";
export type BoatType = "Sloop" | "Sport" | "Cabin Cruiser" | "RIB" | "Center Console" | "Tender";

export interface Boat {
  id: string;
  slug: string;
  name: string;
  type: BoatType;
  price: number;
  lengthMeters: number;
  year: number;
  engine: string;
  condition: BoatCondition;
  status: BoatStatus;
  featured: boolean;
  shortDescription: string;
  description: string;
  images: string[];
  location: string;
}

export const BOATS: Boat[] = [
  {
    id: "1",
    slug: "azure-sport-310",
    name: "Azure Sport 310",
    type: "Sport",
    price: 89500,
    lengthMeters: 9.4,
    year: 2023,
    engine: "Mercury 350HP V8",
    condition: "new",
    status: "available",
    featured: true,
    shortDescription: "A sleek bowrider built for speed and weekend adventures.",
    description:
      "The Azure Sport 310 combines aggressive styling with a refined interior. Twin sun pads, premium upholstery, and a powerful Mercury V8 deliver an unmatched on-water experience. Perfect for IJsselmeer cruising and coastal trips.",
    images: [boat1, boat6, boat3],
    location: "Amsterdam",
  },
  {
    id: "2",
    slug: "klassiek-sloop-720",
    name: "Klassiek Sloop 720",
    type: "Sloop",
    price: 34900,
    lengthMeters: 7.2,
    year: 2019,
    engine: "Vetus 28HP Diesel",
    condition: "used",
    status: "available",
    featured: true,
    shortDescription: "Hand-built mahogany classic sloop, perfect for the canals.",
    description:
      "A timeless mahogany sloop crafted for serene canal cruising. Solid teak deck, brass fittings, and a quiet diesel inboard. Maintained to showroom condition by its single owner.",
    images: [boat2, boat4],
    location: "Utrecht",
  },
  {
    id: "3",
    slug: "coastline-cc-260",
    name: "Coastline CC 260",
    type: "Center Console",
    price: 67500,
    lengthMeters: 7.9,
    year: 2022,
    engine: "Yamaha F300 Outboard",
    condition: "used",
    status: "available",
    featured: true,
    shortDescription: "A versatile center console for fishing and family days out.",
    description:
      "Built for the North Sea, the Coastline CC 260 offers a spacious deck, T-top shade, and integrated rod holders. Yamaha F300 outboard with under 200 hours.",
    images: [boat3, boat5, boat1],
    location: "Den Helder",
  },
  {
    id: "4",
    slug: "stillwater-electric-650",
    name: "Stillwater Electric 650",
    type: "Sloop",
    price: 42000,
    lengthMeters: 6.5,
    year: 2024,
    engine: "Torqeedo Cruise 10.0",
    condition: "new",
    status: "reserved",
    featured: false,
    shortDescription: "Silent electric sloop for the Amsterdam canals.",
    description:
      "Zero emissions, near-silent cruising and a generous lounge area for eight. The Stillwater Electric 650 is the perfect city boat — no license required up to 20km/h.",
    images: [boat4, boat2],
    location: "Amsterdam",
  },
  {
    id: "5",
    slug: "stormrider-rib-540",
    name: "Stormrider RIB 540",
    type: "RIB",
    price: 28500,
    lengthMeters: 5.4,
    year: 2021,
    engine: "Suzuki DF115",
    condition: "used",
    status: "available",
    featured: false,
    shortDescription: "Agile RIB for thrill-seekers and watersports.",
    description:
      "Lightweight, fast and stable. The Stormrider RIB 540 is ideal for waterskiing, diving trips or quick island hops. Trailer included.",
    images: [boat5, boat3],
    location: "Rotterdam",
  },
  {
    id: "6",
    slug: "harbor-cruiser-380",
    name: "Harbor Cruiser 380",
    type: "Cabin Cruiser",
    price: 145000,
    lengthMeters: 11.6,
    year: 2020,
    engine: "Twin Volvo Penta D4",
    condition: "used",
    status: "available",
    featured: true,
    shortDescription: "A spacious cabin cruiser for extended weekends aboard.",
    description:
      "Two cabins, full galley, and twin Volvo Penta diesels. The Harbor Cruiser 380 is a comfortable, capable cruiser for the Wadden Sea or Belgian coast.",
    images: [boat6, boat1, boat4],
    location: "Monnickendam",
  },
  {
    id: "7",
    slug: "tender-classic-520",
    name: "Tender Classic 520",
    type: "Tender",
    price: 19900,
    lengthMeters: 5.2,
    year: 2018,
    engine: "Yanmar 14HP",
    condition: "used",
    status: "sold",
    featured: false,
    shortDescription: "Charming wooden tender, recently restored.",
    description:
      "A beautifully restored wooden tender with a reliable Yanmar diesel. SOLD — included for reference.",
    images: [boat2],
    location: "Loosdrecht",
  },
];

export const BOAT_TYPES: BoatType[] = ["Sloop", "Sport", "Cabin Cruiser", "RIB", "Center Console", "Tender"];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);

export const getBoatBySlug = (slug: string) => BOATS.find((b) => b.slug === slug);
export const getRelatedBoats = (boat: Boat) =>
  BOATS.filter((b) => b.id !== boat.id && b.type === boat.type).slice(0, 3);