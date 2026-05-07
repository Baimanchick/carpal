import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { CarCard } from "@/components/cars/car-card";
import { FEATURED_CARS } from "@/lib/mock/cars";
import { cn } from "@/lib/utils";

export async function FeaturedCars() {
  const t = await getTranslations();
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              {t("Чаще всего бронируют")}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("Машины, которые любят путешественники")}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {t(
                "Отобранные авто с отличными отзывами от иностранных водителей. Готовые к горам, с GPS и эскроу-защитой.",
              )}
            </p>
          </div>
          <Link
            href="/cars"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {t("Все машины")} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_CARS.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
