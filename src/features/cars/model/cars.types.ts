import type { Car } from "@/lib/types";

export type CarsFilters = {
  bodyType?: string;
  city?: string;
  drivetrain?: string;
  hasRoofRack?: boolean;
  instantBook?: boolean;
  lang?: string;
  minDays?: number;
  mountainReady?: boolean;
  routeTag?: string;
  winterReady?: boolean;
};

export type CarListResponse = {
  items: Car[];
  total: number;
};
