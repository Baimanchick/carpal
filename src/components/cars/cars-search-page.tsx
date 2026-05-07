"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "@/i18n/client";
import {
  CalendarDays,
  MapPin,
  Users,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CarCard } from "@/components/cars/car-card";
import {
  FiltersPanel,
  DEFAULT_FILTERS,
  type FilterState,
} from "@/components/cars/filters-panel";
import type { Car } from "@/lib/types";

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating" | "trips";

const SORT_LABEL: Record<SortKey, string> = {
  recommended: "Рекомендуемые",
  "price-asc": "Цена: по возрастанию",
  "price-desc": "Цена: по убыванию",
  rating: "Лучший рейтинг",
  trips: "Больше всего поездок",
};

interface InitialState {
  city?: string;
  from?: string;
  to?: string;
  travellers?: number;
  only4x4?: boolean;
  route?: string;
  experience?: string;
}

interface Props {
  cars: Car[];
  initial: InitialState;
}

export function CarsSearchPage({ cars, initial }: Props) {
  const t = useTranslations();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    drivetrains: initial.only4x4 ? ["4x4"] : [],
  }));
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = useMemo(
    () => applyFilters(cars, filters, initial.city),
    [cars, filters, initial.city],
  );
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="bg-muted/20">
      {/* compact search summary */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-1 flex-wrap items-center gap-2 text-sm">
            <Pill icon={<MapPin className="size-3.5" />}>
              {initial.city ?? t("Любой город")}
            </Pill>
            <Pill icon={<CalendarDays className="size-3.5" />}>
              {initial.from && initial.to
                ? `${initial.from} → ${initial.to}`
                : t("Гибкие даты")}
            </Pill>
            <Pill icon={<Users className="size-3.5" />}>
              {initial.travellers ?? 2} {t("путешественников")}
            </Pill>
            {initial.only4x4 ? (
              <Pill className="bg-amber-100 text-amber-900 ring-amber-200">
                {t("Только 4x4")}
              </Pill>
            ) : null}
          </div>
          <Button variant="outline" size="sm">
            <Search className="size-4" /> {t("Изменить поиск")}
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold">{t("Фильтры")}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("Найдено {found} из {total} машин", {
                  found: filtered.length,
                  total: cars.length,
                })}
              </p>
              <div className="mt-5">
                <FiltersPanel
                  value={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                />
              </div>
            </div>
          </aside>

          <section>
            {/* toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {t("{count} машин в {city}", {
                    count: filtered.length,
                    city: initial.city ?? t("Кыргызстане"),
                  })}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t("Проверено · эскроу-защита · GPS")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="size-4" />
                      {t("Фильтры")}
                      {activeFilterCount ? (
                        <span className="ml-1 rounded-full bg-foreground px-1.5 text-[10px] font-semibold text-background">
                          {activeFilterCount}
                        </span>
                      ) : null}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>{t("Фильтры")}</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto px-4 pb-6">
                      <FiltersPanel
                        value={filters}
                        onChange={setFilters}
                        onReset={() => setFilters(DEFAULT_FILTERS)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="size-4" />
                      <span className="hidden sm:inline">{t("Сортировка:")}</span>
                      {t(SORT_LABEL[sort])}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={(v) => setSort(v as SortKey)}
                    >
                      {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                        <DropdownMenuRadioItem key={k} value={k}>
                          {t(SORT_LABEL[k])}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* active filters */}
            {activeFilterCount > 0 ? (
              <ActiveFilterChips
                filters={filters}
                onChange={setFilters}
                className="mt-4"
              />
            ) : null}

            {/* grid */}
            {sorted.length === 0 ? (
              <EmptyResults onReset={() => setFilters(DEFAULT_FILTERS)} />
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Pill({
  children,
  icon,
  className,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium ring-1 ring-border ${className ?? ""}`}
    >
      {icon}
      {children}
    </span>
  );
}

function ActiveFilterChips({
  filters,
  onChange,
  className,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  className?: string;
}) {
  const t = useTranslations();
  const chips: { label: string; clear: () => void }[] = [];

  filters.bodyTypes.forEach((b) =>
    chips.push({
      label: b,
      clear: () =>
        onChange({
          ...filters,
          bodyTypes: filters.bodyTypes.filter((x) => x !== b),
        }),
    }),
  );
  filters.transmissions.forEach((t) =>
    chips.push({
      label: t,
      clear: () =>
        onChange({
          ...filters,
          transmissions: filters.transmissions.filter((x) => x !== t),
        }),
    }),
  );
  filters.fuels.forEach((f) =>
    chips.push({
      label: f,
      clear: () =>
        onChange({ ...filters, fuels: filters.fuels.filter((x) => x !== f) }),
    }),
  );
  filters.drivetrains.forEach((d) =>
    chips.push({
      label: d,
      clear: () =>
        onChange({
          ...filters,
          drivetrains: filters.drivetrains.filter((x) => x !== d),
        }),
    }),
  );
  filters.routeTags.forEach((r) =>
    chips.push({
      label: r,
      clear: () =>
        onChange({
          ...filters,
          routeTags: filters.routeTags.filter((x) => x !== r),
        }),
    }),
  );
  filters.badges.forEach((b) =>
    chips.push({
      label: b,
      clear: () =>
        onChange({
          ...filters,
          badges: filters.badges.filter((x) => x !== b),
        }),
    }),
  );
  if (filters.priceMin > 0 || filters.priceMax < 200) {
    chips.push({
      label: `$${filters.priceMin}–$${filters.priceMax}/${t("день")}`,
      clear: () => onChange({ ...filters, priceMin: 0, priceMax: 200 }),
    });
  }
  if (filters.hasGps)
    chips.push({
      label: "GPS",
      clear: () => onChange({ ...filters, hasGps: false }),
    });
  if (filters.hasRoofTent)
    chips.push({
      label: t("Палатка на крышу"),
      clear: () => onChange({ ...filters, hasRoofTent: false }),
    });
  if (filters.hasChildSeat)
    chips.push({
      label: t("Детское кресло"),
      clear: () => onChange({ ...filters, hasChildSeat: false }),
    });
  if (filters.hasInsurance)
    chips.push({
      label: t("Страховка"),
      clear: () => onChange({ ...filters, hasInsurance: false }),
    });

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={c.clear}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background transition-colors hover:bg-foreground/80"
        >
          {c.label}
          <X className="size-3" />
        </button>
      ))}
    </div>
  );
}

function EmptyResults({ onReset }: { onReset: () => void }) {
  const t = useTranslations();
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border bg-background p-12 text-center">
      <h3 className="text-lg font-semibold">
        {t("Под эти фильтры ни одна машина не подходит")}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("Расширьте диапазон цен или уберите фильтр.")}
      </p>
      <Button onClick={onReset} variant="outline" className="mt-4">
        {t("Сбросить фильтры")}
      </Button>
    </div>
  );
}

function applyFilters(
  cars: Car[],
  f: FilterState,
  city?: string,
): Car[] {
  return cars.filter((c) => {
    if (city && c.city !== city) return false;
    if (f.bodyTypes.length && !f.bodyTypes.includes(c.bodyType)) return false;
    if (f.transmissions.length && !f.transmissions.includes(c.transmission))
      return false;
    if (f.fuels.length && !f.fuels.includes(c.fuel)) return false;
    if (f.drivetrains.length && !f.drivetrains.includes(c.drivetrain))
      return false;
    if (
      f.routeTags.length &&
      !f.routeTags.some((r) => c.routeTags.includes(r))
    )
      return false;
    if (
      f.badges.length &&
      !f.badges.every((b) => c.badges.includes(b))
    )
      return false;
    if (c.pricePerDay < f.priceMin || c.pricePerDay > f.priceMax) return false;
    if (c.seats < f.seatsMin) return false;
    if (f.hasGps && !c.hasGps) return false;
    if (f.hasRoofTent && !c.hasRoofTent) return false;
    if (f.hasChildSeat && !c.hasChildSeat) return false;
    if (f.hasInsurance && !c.hasInsurance) return false;
    return true;
  });
}

function applySort(cars: Car[], sort: SortKey): Car[] {
  const copy = [...cars];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.pricePerDay - b.pricePerDay);
    case "price-desc":
      return copy.sort((a, b) => b.pricePerDay - a.pricePerDay);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "trips":
      return copy.sort((a, b) => b.trips - a.trips);
    case "recommended":
    default:
      return copy.sort(
        (a, b) =>
          b.badges.length * 0.5 + b.rating - (a.badges.length * 0.5 + a.rating),
      );
  }
}

function countActiveFilters(f: FilterState): number {
  return (
    f.bodyTypes.length +
    f.transmissions.length +
    f.fuels.length +
    f.drivetrains.length +
    f.routeTags.length +
    f.badges.length +
    (f.priceMin > 0 || f.priceMax < 200 ? 1 : 0) +
    (f.hasGps ? 1 : 0) +
    (f.hasRoofTent ? 1 : 0) +
    (f.hasChildSeat ? 1 : 0) +
    (f.hasInsurance ? 1 : 0)
  );
}
