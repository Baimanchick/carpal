import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowUpRight, Mountain, TriangleAlert } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "@/i18n/server";
import { DESTINATIONS } from "@/lib/mock/destinations";

export const metadata = { title: "Популярные маршруты" };

const DIFFICULTY_LABEL = {
  easy: "Лёгкий асфальт",
  moderate: "Смешанные дороги",
  hard: "Только 4x4",
} as const;

const DIFFICULTY_COLOR = {
  easy: "bg-emerald-500/90",
  moderate: "bg-amber-500/90",
  hard: "bg-rose-500/90",
} as const;

const FEATURED_ROUTES = [
  {
    id: "bishkek-sonkul",
    name: "Бишкек → Сон-Куль → Нарын",
    days: 4,
    distance: 580,
    difficulty: "hard" as const,
    blurb: "Юрты, звёзды, горные дороги. Классическое кыргызское приключение.",
    warnings: [
      "Цепи на колёса в апреле–июне",
      "После Кочкора заправок нет",
    ],
    image:
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "issykkul-loop",
    name: "Полная петля вокруг Иссык-Куля",
    days: 5,
    distance: 470,
    difficulty: "easy" as const,
    blurb: "Пляжи, гастрономия Каракола, каньон Сказка. В основном асфальт.",
    warnings: ["Пробки в Чолпон-Ате в июле–августе"],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "pamir",
    name: "Ош → Сары-Таш → Памирский тракт",
    days: 7,
    distance: 720,
    difficulty: "hard" as const,
    blurb:
      "Эпический M41. Граница с Таджикистаном, перевалы 4 000 м, лунные пейзажи.",
    warnings: [
      "Нужен пермит ГБАО",
      "Везите 40 л запасного топлива",
      "Нет связи на 200 км",
    ],
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1600&q=70",
  },
];

interface RoutesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RoutesPage({ params }: RoutesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("Популярные маршруты")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t(
              "Подборка путешествий с описанием качества дорог, сложности, предупреждений и рекомендуемых машин. Нажмите на маршрут — увидите подходящие авто.",
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("Избранные маршруты")}
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {FEATURED_ROUTES.map((r) => (
            <article
              key={r.id}
              className="group relative isolate overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span
                  className={`absolute top-3 left-3 rounded-full ${DIFFICULTY_COLOR[r.difficulty]} px-2 py-0.5 text-[11px] font-semibold text-background`}
                >
                  {t(DIFFICULTY_LABEL[r.difficulty])}
                </span>
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold tracking-tight">
                  {t(r.name)}
                </h3>
                <p className="text-sm text-muted-foreground">{t(r.blurb)}</p>
                <ul className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-muted px-2 py-1 font-medium">
                    {r.days} {t("дн.")}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1 font-medium">
                    {r.distance} {t("км")}
                  </span>
                </ul>
                <ul className="space-y-1.5 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/60">
                  {r.warnings.map((w) => (
                    <li key={w} className="flex items-start gap-2">
                      <TriangleAlert className="size-3.5 shrink-0" />
                      {t(w)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cars?route=4x4"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
                >
                  {t("Найти машины для этого маршрута")}{" "}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("Все направления")}
          </h2>
          <span className="text-xs text-muted-foreground">
            <Mountain className="mr-1 inline size-3.5" />
            {t("Метка сложности показывает минимальные требования к машине")}
          </span>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="relative z-10 mt-auto w-full p-5 text-background">
                <span
                  className={`rounded-full ${DIFFICULTY_COLOR[d.difficulty]} px-2 py-0.5 text-[11px] font-semibold`}
                >
                  {t(DIFFICULTY_LABEL[d.difficulty])}
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  {d.name}
                </h3>
                <p className="mt-1 text-xs text-background/80">
                  {d.region} · {d.carsCount} {t("машин")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
