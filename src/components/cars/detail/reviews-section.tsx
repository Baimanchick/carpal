import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "@/i18n/client";
import type { Review } from "@/lib/types";

interface Props {
  reviews: Review[];
  rating: number;
  reviewsCount: number;
}

export function ReviewsSection({ reviews, rating, reviewsCount }: Props) {
  const t = useTranslations();
  const breakdown = computeBreakdown(reviews);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {t("Отзывы путешественников")}
          </h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm">
            <Star className="size-4 fill-foreground text-foreground" />
            <span className="font-semibold">{rating.toFixed(2)}</span>
            <span className="text-muted-foreground">
              · {reviewsCount} {t("отзывов")}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        <ul className="space-y-1.5">
          {breakdown.map((b) => (
            <li key={b.label} className="flex items-center gap-2 text-xs">
              <span className="w-24 text-muted-foreground">{t(b.label)}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-foreground"
                  style={{ width: `${b.value * 20}%` }}
                />
              </span>
              <span className="w-8 text-right tabular-nums font-semibold">
                {b.value.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>

        <ul className="space-y-5">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="border-b border-dashed border-border pb-5 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <Image
                  src={r.authorAvatar}
                  alt={r.authorName}
                  width={36}
                  height={36}
                  unoptimized
                  className="size-9 rounded-full bg-muted"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{r.authorName}</p>
                    <span className="text-xs text-muted-foreground">
                      · {r.authorCountry}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="size-3 fill-current" />
                      ))}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.date} · {r.trip}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function computeBreakdown(reviews: Review[]) {
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviews.length, 1);
  return [
    { label: "Чистота", value: Math.min(5, avg + 0.05) },
    { label: "Коммуникация", value: Math.min(5, avg + 0.1) },
    { label: "Соответствие", value: avg },
    { label: "В горах", value: Math.max(0, avg - 0.15) },
    { label: "Дружелюбно к туристам", value: Math.min(5, avg + 0.2) },
  ];
}
