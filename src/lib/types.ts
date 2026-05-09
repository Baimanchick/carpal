export type VerificationBadge =
  | "verified"
  | "tech-checked"
  | "mountain-ready"
  | "winter-ready"
  | "gps"
  | "tourist-safe"
  | "premium-owner"
  | "english-owner"
  | "insurance"
  | "instant-book"
  | "4x4";

export type Transmission = "automatic" | "manual";
export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";
export type Drivetrain = "fwd" | "rwd" | "awd" | "4x4";
export type CarBodyType =
  | "sedan"
  | "crossover"
  | "suv"
  | "minivan"
  | "pickup"
  | "hatchback";

export type City = string;

export type RouteTag = string;

export const KNOWN_CITIES = [
  "Bishkek",
  "Osh",
  "Karakol",
  "Cholpon-Ata",
  "Naryn",
  "Talas",
] as const;

export const KNOWN_ROUTE_TAGS = [
  "Son-Kul",
  "Issyk-Kul",
  "Ala-Archa",
  "Karakol",
  "Chon-Kemin",
  "Pamir Highway",
] as const;

export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  trips: number;
  responseRate: number;
  languages: string[];
  isPro?: boolean;
  joinedYear: number;
}

export interface Car {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  bodyType: CarBodyType;
  transmission: Transmission;
  fuel: FuelType;
  drivetrain: Drivetrain;
  seats: number;
  groundClearance: number; // mm
  fuelConsumption: number; // L/100km
  pricePerDay: number; // USD
  deposit: number; // USD
  discountWeekly?: number | null; // %
  discountMonthly?: number | null; // %
  city: City;
  pickupLocation: string;
  badges: string[];
  routeTags: string[];
  rating: number;
  trips: number;
  reviewsCount: number;
  photos: string[];
  hostId: string;
  features: string[];
  description: string;
  hasGps: boolean;
  hasRoofTent: boolean;
  hasChildSeat: boolean;
  hasInsurance: boolean;
  hasRoofRack: boolean;
  mountainReady: boolean;
  winterReady: boolean;
  instantBook: boolean;
  host?: Host | null;
}

export interface Review {
  id: string;
  carId: string;
  authorName: string;
  authorCountry: string;
  authorAvatar: string;
  rating: number;
  date: string;
  text: string;
  trip?: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  imageUrl: string;
  carsCount: number;
  difficulty: "easy" | "moderate" | "hard";
  blurb: string;
}
