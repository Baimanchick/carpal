"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/i18n/client";
import {
  CalendarDays,
  Lock,
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Car } from "@/lib/types";

interface Props {
  car: Car;
}

const SERVICE_FEE_RATE = 0.12;
const INSURANCE_RATE = 0.18;

export function BookingWidget({ car }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>();
  const [insurance, setInsurance] = useState(true);

  const days = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return Math.max(1, differenceInCalendarDays(range.to, range.from));
  }, [range]);

  const subtotal = car.pricePerDay * days;
  const discount =
    days >= 7 && car.discountWeekly
      ? subtotal * (car.discountWeekly / 100)
      : 0;
  const insuranceCost = insurance ? subtotal * INSURANCE_RATE : 0;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const total = Math.max(0, subtotal - discount + serviceFee + insuranceCost);

  function onContinue() {
    const params = new URLSearchParams();
    if (range?.from) params.set("from", format(range.from, "yyyy-MM-dd"));
    if (range?.to) params.set("to", format(range.to, "yyyy-MM-dd"));
    if (insurance) params.set("insurance", "1");
    router.push(`/booking/${car.slug}?${params.toString()}`);
  }

  const canContinue = days > 0;

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-semibold">${car.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">
            {" "}
            / {t("день")}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm">
          <Star className="size-3.5 fill-foreground text-foreground" />
          {car.rating.toFixed(2)}
          <span className="text-muted-foreground">({car.reviewsCount})</span>
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-border">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="grid w-full grid-cols-2 divide-x divide-border text-left"
            >
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("Получение")}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-sm">
                  <CalendarDays className="size-3.5" />
                  {range?.from
                    ? format(range.from, "MMM d")
                    : t("Выбрать дату")}
                </p>
              </div>
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("Возврат")}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-sm">
                  <CalendarDays className="size-3.5" />
                  {range?.to ? format(range.to, "MMM d") : t("Выбрать дату")}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={setRange}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <label className="mt-4 flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand" />
          {t("Полная страховка")}
        </span>
        <Switch checked={insurance} onCheckedChange={setInsurance} />
      </label>

      <ul className="mt-4 space-y-1.5 text-sm">
        <Row
          label={
            days > 0
              ? t("${price} × {days} {dayWord}", {
                  price: car.pricePerDay,
                  days,
                  dayWord: days === 1 ? t("день") : t("дн."),
                })
              : t("Выберите даты, чтобы увидеть итог")
          }
          value={days > 0 ? `$${subtotal.toFixed(0)}` : null}
        />
        {discount > 0 ? (
          <Row
            label={t("Скидка за неделю ({percent}%)", {
              percent: car.discountWeekly ?? 0,
            })}
            value={`−$${discount.toFixed(0)}`}
            tone="emerald"
          />
        ) : null}
        {insurance && days > 0 ? (
          <Row label={t("Страховка")} value={`$${insuranceCost.toFixed(0)}`} />
        ) : null}
        {days > 0 ? (
          <Row label={t("Сервисный сбор")} value={`$${serviceFee.toFixed(0)}`} />
        ) : null}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-border pt-3 text-sm font-semibold">
        <span>{t("Итого")}</span>
        <span className="text-lg">${total.toFixed(0)}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("+ ${deposit} возвратный залог (заморожен в эскроу)", {
          deposit: car.deposit,
        })}
      </p>

      <Button
        size="lg"
        disabled={!canContinue}
        onClick={onContinue}
        className="mt-4 w-full bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-40"
      >
        {t("Перейти к оформлению")} <ArrowRight className="size-4" />
      </Button>

      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        {t(
          "Деньги ещё не списываются. Сумма заморожена в эскроу до конца поездки.",
        )}
      </p>
    </aside>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | null;
  tone?: "emerald";
}) {
  return (
    <li
      className={`flex items-center justify-between text-sm ${tone === "emerald" ? "text-emerald-700 dark:text-emerald-400" : ""}`}
    >
      <span className="text-muted-foreground">{label}</span>
      {value ? <span className="font-medium">{value}</span> : null}
    </li>
  );
}
