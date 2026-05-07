import {
  Lock,
  Wallet,
  Car,
  Flag,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "@/i18n/client";
import { cn } from "@/lib/utils";

export type EscrowStep =
  | "reserved"
  | "funded"
  | "active"
  | "returned"
  | "released";

const STEPS: { id: EscrowStep; label: string; icon: LucideIcon }[] = [
  { id: "reserved", label: "Забронировано", icon: Lock },
  { id: "funded", label: "Оплачено", icon: Wallet },
  { id: "active", label: "Поездка", icon: Car },
  { id: "returned", label: "Возвращено", icon: Flag },
  { id: "released", label: "Выплачено", icon: BadgeCheck },
];

interface Props {
  current: EscrowStep;
  className?: string;
}

export function EscrowProgress({ current, className }: Props) {
  const t = useTranslations();
  const idx = STEPS.findIndex((s) => s.id === current);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">
          {t("Статус эскроу")}
        </h3>
        <span className="text-xs text-muted-foreground">
          {t("Деньги заморожены до конца поездки")}
        </span>
      </div>
      <ol className="grid grid-cols-5 gap-1.5 text-center">
        {STEPS.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li key={s.id} className="space-y-1.5">
              <div className="relative flex items-center justify-center">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full ring-2 transition-colors",
                    done && "bg-emerald-500 text-background ring-emerald-200",
                    active &&
                      "bg-foreground text-background ring-foreground/20",
                    !done &&
                      !active &&
                      "bg-muted text-muted-foreground ring-border",
                  )}
                >
                  <s.icon className="size-4" />
                </span>
                {i < STEPS.length - 1 ? (
                  <span
                    className={cn(
                      "absolute top-1/2 left-[calc(50%+1.125rem)] h-0.5 w-[calc(100%-2.25rem)] -translate-y-1/2 transition-colors",
                      done ? "bg-emerald-400" : "bg-border",
                    )}
                  />
                ) : null}
              </div>
              <p
                className={cn(
                  "text-[10.5px] font-medium leading-tight",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {t(s.label)}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
