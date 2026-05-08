"use client";

import { useState } from "react";
import { useTranslations } from "@/i18n/client";
import { useRouter } from "@/i18n/navigation";
import {
  CalendarDays,
  MapPin,
  Mountain,
  Users,
  Search,
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
  const [experience, setExperience] = useState("intermediate");

  function onSearch() {
    const params = new URLSearchParams({
      city,
      travellers,
      experience,
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
              "url(https://wallpapercat.com/w/full/5/a/f/627218-2560x1440-desktop-hd-kyrgyzstan-background-image.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/35 to-foreground/85" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="max-w-2xl">
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t("Аренда машин в Кыргызстане")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-background/75 sm:text-lg">
            {t("Насладитесь самыми красивыми видами Кыргызстана.")}
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-background p-2 text-foreground shadow-2xl ring-1 ring-foreground/5 lg:p-2.5">
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
        </div>
      </div>
    </div>
  );
}
