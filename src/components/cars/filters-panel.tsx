"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  CarBodyType,
  Drivetrain,
  FuelType,
  RouteTag,
  Transmission,
  VerificationBadge,
} from "@/lib/types";

export interface FilterState {
  bodyTypes: CarBodyType[];
  transmissions: Transmission[];
  fuels: FuelType[];
  drivetrains: Drivetrain[];
  routeTags: RouteTag[];
  badges: VerificationBadge[];
  priceMin: number;
  priceMax: number;
  seatsMin: number;
  hasGps: boolean;
  hasRoofTent: boolean;
  hasChildSeat: boolean;
  hasInsurance: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  bodyTypes: [],
  transmissions: [],
  fuels: [],
  drivetrains: [],
  routeTags: [],
  badges: [],
  priceMin: 0,
  priceMax: 200,
  seatsMin: 1,
  hasGps: false,
  hasRoofTent: false,
  hasChildSeat: false,
  hasInsurance: false,
};

const BODY_TYPES: { value: CarBodyType; label: string }[] = [
  { value: "sedan", label: "Седан" },
  { value: "crossover", label: "Кроссовер" },
  { value: "suv", label: "Внедорожник" },
  { value: "minivan", label: "Минивэн" },
  { value: "pickup", label: "Пикап" },
  { value: "hatchback", label: "Хэтчбек" },
];

const TRANSMISSIONS: { value: Transmission; label: string }[] = [
  { value: "automatic", label: "Автомат" },
  { value: "manual", label: "Механика" },
];

const FUELS: { value: FuelType; label: string }[] = [
  { value: "petrol", label: "Бензин" },
  { value: "diesel", label: "Дизель" },
  { value: "hybrid", label: "Гибрид" },
  { value: "electric", label: "Электро" },
];

const DRIVETRAINS: { value: Drivetrain; label: string }[] = [
  { value: "4x4", label: "4x4" },
  { value: "awd", label: "AWD" },
  { value: "fwd", label: "FWD" },
  { value: "rwd", label: "RWD" },
];

const ROUTE_TAGS: { value: RouteTag; label: string }[] = [
  { value: "Son-Kul", label: "Son-Kul" },
  { value: "Issyk-Kul", label: "Issyk-Kul" },
  { value: "Karakol", label: "Karakol" },
  { value: "Ala-Archa", label: "Ala-Archa" },
  { value: "Chon-Kemin", label: "Chon-Kemin" },
  { value: "Pamir Highway", label: "Pamir Highway" },
];

const BADGES: { value: VerificationBadge; label: string }[] = [
  { value: "mountain-ready", label: "Готов к горам" },
  { value: "winter-ready", label: "Готов к зиме" },
  { value: "tourist-safe", label: "Безопасно для туристов" },
  { value: "english-owner", label: "Хост говорит по-английски" },
  { value: "premium-owner", label: "Премиум-хост" },
  { value: "tech-checked", label: "Тех-осмотр" },
];

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  className?: string;
}

export function FiltersPanel({ value, onChange, onReset, className }: Props) {
  const t = useTranslations();

  function toggleArr<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  return (
    <div className={cn("flex flex-col gap-6 text-sm", className)}>
      <FilterGroup title={t("Цена за день (USD)")}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={value.priceMin}
            onChange={(e) =>
              onChange({ ...value, priceMin: Number(e.target.value) || 0 })
            }
            placeholder={t("Мин")}
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min={0}
            value={value.priceMax}
            onChange={(e) =>
              onChange({ ...value, priceMax: Number(e.target.value) || 0 })
            }
            placeholder={t("Макс")}
            className="h-9"
          />
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup title={t("Тип кузова")}>
        <CheckboxList
          options={BODY_TYPES}
          selected={value.bodyTypes}
          onToggle={(v) =>
            onChange({ ...value, bodyTypes: toggleArr(value.bodyTypes, v) })
          }
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title={t("Коробка передач")}>
        <CheckboxList
          options={TRANSMISSIONS}
          selected={value.transmissions}
          onToggle={(v) =>
            onChange({
              ...value,
              transmissions: toggleArr(value.transmissions, v),
            })
          }
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title={t("Привод")}>
        <CheckboxList
          options={DRIVETRAINS}
          selected={value.drivetrains}
          onToggle={(v) =>
            onChange({
              ...value,
              drivetrains: toggleArr(value.drivetrains, v),
            })
          }
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title={t("Топливо")}>
        <CheckboxList
          options={FUELS}
          selected={value.fuels}
          onToggle={(v) =>
            onChange({ ...value, fuels: toggleArr(value.fuels, v) })
          }
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title={t("Подходит для маршрута")}>
        <CheckboxList
          options={ROUTE_TAGS}
          selected={value.routeTags}
          onToggle={(v) =>
            onChange({
              ...value,
              routeTags: toggleArr(value.routeTags, v),
            })
          }
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title={t("Верификация")}>
        <CheckboxList
          options={BADGES}
          selected={value.badges}
          onToggle={(v) =>
            onChange({ ...value, badges: toggleArr(value.badges, v) })
          }
        />
      </FilterGroup>

      <Separator />

      <FilterGroup title={t("Оборудование")}>
        <SwitchRow
          label={t("GPS-трекер")}
          checked={value.hasGps}
          onChange={(v) => onChange({ ...value, hasGps: v })}
        />
        <SwitchRow
          label={t("Палатка на крышу")}
          checked={value.hasRoofTent}
          onChange={(v) => onChange({ ...value, hasRoofTent: v })}
        />
        <SwitchRow
          label={t("Детское кресло")}
          checked={value.hasChildSeat}
          onChange={(v) => onChange({ ...value, hasChildSeat: v })}
        />
        <SwitchRow
          label={t("Страховка")}
          checked={value.hasInsurance}
          onChange={(v) => onChange({ ...value, hasInsurance: v })}
        />
      </FilterGroup>

      <Separator />

      <button
        type="button"
        onClick={onReset}
        className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
      >
        {t("Сбросить все фильтры")}
      </button>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxList<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  const t = useTranslations();
  return (
    <ul className="space-y-2">
      {options.map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <li key={opt.value}>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={checked}
                onCheckedChange={() => onToggle(opt.value)}
              />
              {t(opt.label)}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
