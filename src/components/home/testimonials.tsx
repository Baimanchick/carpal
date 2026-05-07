import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { getTranslations } from "@/i18n/server";
import { TESTIMONIALS } from "@/lib/mock/reviews";

export async function Testimonials() {
  const t = await getTranslations();
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              {t("С дороги")}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("Реальные отзывы реальных путешественников")}
            </h2>
          </div>
          <span className="rounded-full bg-background px-3 py-1.5 text-xs font-medium ring-1 ring-border">
            ★ 4.92 {t("средний рейтинг · 2 418 поездок")}
          </span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((r) => (
            <article
              key={r.id}
              className="relative rounded-2xl border border-border bg-card p-5"
            >
              <Quote className="size-5 text-brand/40" />
              <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Image
                  src={r.authorAvatar}
                  alt={r.authorName}
                  width={36}
                  height={36}
                  className="size-9 rounded-full bg-muted"
                  unoptimized
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {r.authorName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.authorCountry} · {r.trip}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-3 fill-current" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
