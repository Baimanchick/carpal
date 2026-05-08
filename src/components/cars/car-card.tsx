'use client'

import Image from "next/image";
import { Star, Users, Fuel, Cog, MapPin } from "lucide-react";
import { useTranslations } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";
import { VerificationBadge } from "./verification-badge";

interface Props {
  car: Car;
  className?: string;
}

const fuelLabel: Record<Car["fuel"], string> = {
  petrol: "Бензин",
  diesel: "Дизель",
  hybrid: "Гибрид",
  electric: "Электро",
};

const transmissionLabel: Record<Car["transmission"], string> = {
  automatic: "Автомат",
  manual: "Механика",
};

export function CarCard({ car, className }: Props) {
  const t = useTranslations();
  const topBadges = car.badges.slice(0, 3);

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={car.photos[0]}
          alt={`${car.make} ${car.model}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {topBadges.map((b) => (
            <VerificationBadge key={b} kind={b} />
          ))}
        </div>
        {car.discountWeekly ? (
          <span className="absolute top-3 right-3 rounded-full bg-foreground px-2 py-1 text-[11px] font-semibold text-background">
            −{car.discountWeekly}% / {t("неделя")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight">
              {car.make} {car.model}
            </h3>
            <p className="text-xs text-muted-foreground">
              {car.year} · {car.bodyType}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Star className="size-4 fill-foreground text-foreground" />
            {car.rating.toFixed(2)}
            <span className="text-xs font-normal text-muted-foreground">
              ({car.trips})
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <li className="inline-flex items-center gap-1">
            <Cog className="size-3.5" /> {t(transmissionLabel[car.transmission])}
          </li>
          <li className="inline-flex items-center gap-1">
            <Fuel className="size-3.5" /> {t(fuelLabel[car.fuel])}
          </li>
          <li className="inline-flex items-center gap-1">
            <Users className="size-3.5" /> {car.seats}
          </li>
          <li className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> {car.city}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between border-t border-dashed border-border pt-3">
          <div>
            <span className="text-lg font-semibold">${car.pricePerDay}</span>
            <span className="text-xs text-muted-foreground"> / {t("день")}</span>
            <p className="text-[11px] text-muted-foreground">
              ${car.deposit} {t("залог")}
            </p>
          </div>
          {car.routeTags[0] ? (
            <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
              {t("Для")} {car.routeTags[0]}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
