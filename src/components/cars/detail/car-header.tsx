import Link from "next/link";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Car } from "@/lib/types";
import { VerificationBadge } from "@/components/cars/verification-badge";

export function CarHeader({ car }: { car: Car }) {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          {t("Главная")}
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/cars" className="hover:text-foreground">
          {t("Машины")}
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">
          {car.make} {car.model}
        </span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {car.make} {car.model}
            <span className="ml-2 text-muted-foreground">{car.year}</span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1 font-medium">
              <Star className="size-4 fill-foreground text-foreground" />
              {car.rating.toFixed(2)}
              <span className="text-muted-foreground">
                ({car.reviewsCount} {t("отзывов")})
              </span>
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {car.trips} {t("поездок")}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-3.5" /> {car.city} · {car.pickupLocation}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {car.badges.map((b) => (
          <VerificationBadge key={b} kind={b} size="md" />
        ))}
      </div>
    </div>
  );
}
