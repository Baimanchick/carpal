import "server-only";

import type {
  CarListResponse,
  CarsFilters,
} from "@/features/cars/model/cars.types";
import type { Car } from "@/lib/types";

function getApiUrl() {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error("API_URL is not configured");
  }

  return apiUrl;
}

const REVALIDATE_SECONDS = 60;

export function localeToLang(locale: string): "en" | "ru" {
  return locale === "ru" ? "ru" : "en";
}

function buildCarsQueryString(filters: CarsFilters) {
  const params = new URLSearchParams();

  if (filters.lang) {
    params.set("lang", filters.lang);
  }

  if (filters.city) {
    params.set("city", filters.city);
  }

  if (filters.drivetrain) {
    params.set("drivetrain", filters.drivetrain);
  }

  if (filters.bodyType) {
    params.set("body_type", filters.bodyType);
  }

  if (filters.minDays !== undefined) {
    params.set("min_days", String(filters.minDays));
  }

  if (filters.mountainReady !== undefined) {
    params.set("mountain_ready", String(filters.mountainReady));
  }

  if (filters.instantBook !== undefined) {
    params.set("instant_book", String(filters.instantBook));
  }

  if (filters.winterReady !== undefined) {
    params.set("winter_ready", String(filters.winterReady));
  }

  if (filters.hasRoofRack !== undefined) {
    params.set("has_roof_rack", String(filters.hasRoofRack));
  }

  if (filters.routeTag) {
    params.set("route_tag", filters.routeTag);
  }

  return params.toString();
}

export async function listCars(
  filters: CarsFilters = {},
): Promise<CarListResponse> {
  const query = buildCarsQueryString(filters);
  const url = `${getApiUrl()}/cars${query ? `?${query}` : ""}`;
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["cars"] },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch cars: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function getCar(
  slug: string,
  lang?: string,
): Promise<Car | null> {
  const params = new URLSearchParams();

  if (lang) {
    params.set("lang", lang);
  }

  const query = params.toString();
  const url = `${getApiUrl()}/cars/${encodeURIComponent(slug)}${query ? `?${query}` : ""}`;
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["cars", `car:${slug}`] },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch car ${slug}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
