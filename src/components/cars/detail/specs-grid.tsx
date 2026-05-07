import {
  Calendar,
  Cog,
  Fuel,
  Compass,
  Users,
  Mountain,
  Gauge,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Car } from "@/lib/types";

export function SpecsGrid({ car }: { car: Car }) {
  const t = useTranslations();
  const specs: { icon: typeof Calendar; label: string; value: string }[] = [
    { icon: Calendar, label: t("Год"), value: String(car.year) },
    { icon: Cog, label: t("Коробка передач"), value: car.transmission },
    { icon: Fuel, label: t("Топливо"), value: car.fuel },
    {
      icon: Compass,
      label: t("Привод"),
      value: car.drivetrain.toUpperCase(),
    },
    { icon: Users, label: t("Мест"), value: String(car.seats) },
    {
      icon: Mountain,
      label: t("Клиренс"),
      value: `${car.groundClearance} ${t("мм")}`,
    },
    {
      icon: Gauge,
      label: t("Расход"),
      value: `${car.fuelConsumption} ${t("л / 100 км")}`,
    },
    { icon: Wrench, label: t("Тип кузова"), value: car.bodyType },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight">
        {t("Характеристики авто")}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {specs.map((s) => (
          <li
            key={s.label}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
          >
            <s.icon className="mt-0.5 size-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className="text-sm font-semibold capitalize">{s.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
