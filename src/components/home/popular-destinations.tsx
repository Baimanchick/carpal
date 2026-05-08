import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "@/i18n/server";
import { Link } from "@/i18n/navigation";
import { DESTINATIONS } from "@/lib/mock/destinations";

const DIFFICULTY_LABEL: Record<"easy" | "moderate" | "hard", string> = {
  easy: "Лёгкий асфальт",
  moderate: "Смешанные дороги",
  hard: "Только 4x4",
};

const DIFFICULTY_TONE: Record<"easy" | "moderate" | "hard", string> = {
  easy: "bg-emerald-500/90",
  moderate: "bg-amber-500/90",
  hard: "bg-rose-500/90",
};

export async function PopularDestinations() {
  const t = await getTranslations();
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              {t("Популярные маршруты")}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("Куда поехать")}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {t(
                "У каждого маршрута указана рекомендованная сложность — чтобы не бронировать седан на 4x4-трассу.",
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.id}
              href={`/cars?route=${d.id}`}
              className="group relative isolate flex aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={d.imageUrl}
                alt={d.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="relative z-10 mt-auto w-full p-5 text-background">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-background ${DIFFICULTY_TONE[d.difficulty]}`}
                  >
                    {t(DIFFICULTY_LABEL[d.difficulty])}
                  </span>
                  <span className="text-xs text-background/80">
                    {d.carsCount} {t("машин")}
                  </span>
                </div>
                <h3 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  {d.name}
                  <ArrowUpRight className="size-4 translate-y-px opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-1 text-xs text-background/75">
                  {d.region} · {d.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
