"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  MapPin,
  Mountain,
  Users,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

const CITIES = ["Bishkek", "Osh", "Karakol", "Cholpon-Ata", "Naryn", "Talas"];

export function HeroSearch() {
  const t = useTranslations();
  const router = useRouter();
  const [city, setCity] = useState("Bishkek");
  const [range, setRange] = useState<DateRange | undefined>();
  const [travellers, setTravellers] = useState("2");
  const [needs4x4, setNeeds4x4] = useState(false);
  const [experience, setExperience] = useState("intermediate");

  function onSearch() {
    const params = new URLSearchParams({
      city,
      travellers,
      experience,
      ...(needs4x4 ? { drivetrain: "4x4" } : {}),
      ...(range?.from ? { from: range.from.toISOString().slice(0, 10) } : {}),
      ...(range?.to ? { to: range.to.toISOString().slice(0, 10) } : {}),
    });
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <div className="relative isolate overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 -z-10">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=2400&q=70)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/35 to-foreground/85" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-medium ring-1 ring-background/20 backdrop-blur">
            <Sparkles className="size-3.5" />
            {t("P2P аренда машин для путешественников по Кыргызстану")}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t("Откройте Кыргызстан,")}
            <br />
            <span className="text-brand">{t("на своих условиях.")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-background/75 sm:text-lg">
            {t(
              "Проверенные горные авто от локальных хостов. Эскроу-платежи, GPS, страховка и встроенный гид по безопасности.",
            )}
          </p>
          <a
            href="/map"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-background/95 underline-offset-4 hover:underline"
          >
            {t("Открыть живую карту безопасности →")}
          </a>
        </div>

        <div className="mt-10 rounded-2xl bg-background p-2 text-foreground shadow-2xl ring-1 ring-foreground/5 lg:p-2.5">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-[1.4fr_1.6fr_1fr_1fr_auto]">
            <div className="rounded-xl px-4 py-3 hover:bg-muted/60">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("Город получения")}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-7 w-full border-none bg-transparent p-0 shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="rounded-xl px-4 py-3 text-left hover:bg-muted/60"
                >
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("Даты поездки")}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-sm">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    {range?.from && range?.to
                      ? `${format(range.from, "MMM d")} → ${format(range.to, "MMM d")}`
                      : range?.from
                        ? `${format(range.from, "MMM d")} → ?`
                        : t("Выбрать даты")}
                  </span>
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

            <div className="rounded-xl px-4 py-3 hover:bg-muted/60">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("Путешественники")}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  max={9}
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                  className="h-7 border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="rounded-xl px-4 py-3 hover:bg-muted/60">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("Уровень вождения")}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Mountain className="size-4 text-muted-foreground" />
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="h-7 w-full border-none bg-transparent p-0 shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{t("Новичок")}</SelectItem>
                    <SelectItem value="intermediate">
                      {t("Средний")}
                    </SelectItem>
                    <SelectItem value="experienced">
                      {t("Опытный")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={onSearch}
              className={cn(
                "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
                "h-11 self-center px-6 text-sm font-semibold lg:my-1.5",
              )}
            >
              <Search className="size-4" />
              {t("Поиск")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border px-4 pt-3 pb-1 text-xs text-muted-foreground">
            <label className="flex items-center gap-2">
              <Switch checked={needs4x4} onCheckedChange={setNeeds4x4} />
              <span>{t("Нужен 4x4 / горный авто")}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-2 py-1 font-medium">
                ✦ {t("Эскроу-защита")}
              </span>
              <span className="rounded-full bg-muted px-2 py-1 font-medium">
                ✦ {t("Проверенные хосты")}
              </span>
              <span className="hidden rounded-full bg-muted px-2 py-1 font-medium sm:inline">
                ✦ {t("Оплата USDT")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
