import { Check } from "lucide-react";
import { useTranslations } from "@/i18n/client";
import type { Car } from "@/lib/types";

export function FeaturesList({ car }: { car: Car }) {
  const t = useTranslations();
  if (!car.features.length) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight">
        {t("Оборудование и опции")}
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {car.features.map((f) => (
          <li
            key={f}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <Check className="size-4 text-emerald-600" />
            {t(f)}
          </li>
        ))}
      </ul>
    </section>
  );
}
