import {
  Satellite,
  ShieldCheck,
  FileCheck,
  Wrench,
  CircleCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Car } from "@/lib/types";

export function SafetyStatus({ car }: { car: Car }) {
  const t = useTranslations();
  const items = [
    {
      icon: FileCheck,
      label: t("Документы проверены"),
      ok: car.badges.includes("verified"),
    },
    {
      icon: Wrench,
      label: t("Тех-осмотр пройден"),
      ok: car.badges.includes("tech-checked"),
    },
    {
      icon: Satellite,
      label: t("GPS-трекер установлен"),
      ok: car.hasGps,
    },
    {
      icon: ShieldCheck,
      label: t("Страховка активна"),
      ok: car.hasInsurance,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold tracking-tight">
        {t("Статус безопасности")}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <li
            key={it.label}
            className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
              it.ok
                ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-950/60 dark:bg-emerald-950/30"
                : "border-border bg-muted/40"
            }`}
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                it.ok
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "bg-background text-muted-foreground"
              }`}
            >
              <it.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{it.label}</p>
              <p className="text-xs text-muted-foreground">
                {it.ok ? (
                  <span className="inline-flex items-center gap-1">
                    <CircleCheck className="size-3" /> {t("Подтверждено")}
                  </span>
                ) : (
                  t("Не указано")
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
