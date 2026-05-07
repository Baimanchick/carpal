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
  | "four-wd";

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

export type City =
  | "Bishkek"
  | "Osh"
  | "Karakol"
  | "Cholpon-Ata"
  | "Naryn"
  | "Talas";

export type RouteTag =
  | "Son-Kul"
  | "Issyk-Kul"
  | "Ala-Archa"
  | "Karakol"
  | "Chon-Kemin"
  | "Pamir Highway";

export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  trips: number;
  responseRate: number;
  languages: ("ru" | "kg" | "en")[];
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
  discountWeekly?: number; // %
  discountMonthly?: number; // %
  city: City;
  pickupLocation: string;
  badges: VerificationBadge[];
  routeTags: RouteTag[];
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
