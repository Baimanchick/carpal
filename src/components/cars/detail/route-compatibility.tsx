import { Check, TriangleAlert, Mountain } from "lucide-react";
import { useTranslations } from "@/i18n/client";
import type { Car, RouteTag } from "@/lib/types";

const ALL_ROUTES: { value: RouteTag; difficulty: string }[] = [
  { value: "Issyk-Kul", difficulty: "лёгкий" },
  { value: "Ala-Archa", difficulty: "лёгкий" },
  { value: "Karakol", difficulty: "средний" },
  { value: "Chon-Kemin", difficulty: "средний" },
  { value: "Son-Kul", difficulty: "сложный" },
  { value: "Pamir Highway", difficulty: "сложный" },
];

export function RouteCompatibility({ car }: { car: Car }) {
  const t = useTranslations();
  const compatible = car.routeTags;
  const notRecommended = ALL_ROUTES.filter(
    (r) => !compatible.includes(r.value),
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Mountain className="size-4 text-brand" />
        <h2 className="text-lg font-semibold tracking-tight">
          {t("Совместимость с маршрутами")}
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(
          "Маршруты, помеченные владельцем, для которых эта машина подходит — по резине, клиренсу и приводу.",
        )}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            {t("Рекомендуем")}
          </p>
          <ul className="mt-2 space-y-1.5">
            {compatible.map((r) => (
              <li key={r} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-emerald-600" /> {r}
              </li>
            ))}
            {compatible.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                {t("Владелец не указал маршруты.")}
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            {t("Осторожнее")}
          </p>
          <ul className="mt-2 space-y-1.5">
            {notRecommended.map((r) => (
              <li key={r.value} className="flex items-center gap-2 text-sm">
                <TriangleAlert className="size-4 text-amber-600" /> {r.value}
                <span className="text-xs text-muted-foreground">
                  · {t(r.difficulty)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
