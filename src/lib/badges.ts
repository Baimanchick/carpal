import {
  BadgeCheck,
  Wrench,
  Mountain,
  Snowflake,
  Satellite,
  Globe,
  Crown,
  Languages,
  ShieldCheck,
  Compass,
  type LucideIcon,
} from "lucide-react";
import type { VerificationBadge } from "@/lib/types";

export interface BadgeMeta {
  label: string;
  icon: LucideIcon;
  tone:
    | "emerald"
    | "blue"
    | "amber"
    | "sky"
    | "violet"
    | "neutral"
    | "rose"
    | "teal";
  description: string;
}

export const BADGE_META: Record<VerificationBadge, BadgeMeta> = {
  verified: {
    label: "Проверено",
    icon: BadgeCheck,
    tone: "emerald",
    description: "Документы и личность владельца проверены CarPal.",
  },
  "tech-checked": {
    label: "Тех-осмотр",
    icon: Wrench,
    tone: "blue",
    description: "Прошёл механический осмотр у партнёрского сервиса.",
  },
  "mountain-ready": {
    label: "Готов к горам",
    icon: Mountain,
    tone: "amber",
    description: "Подходит для грунтовых горных дорог и высоких перевалов.",
  },
  "winter-ready": {
    label: "Готов к зиме",
    icon: Snowflake,
    tone: "sky",
    description: "Зимняя резина, рабочая печка и цепи в комплекте.",
  },
  gps: {
    label: "GPS",
    icon: Satellite,
    tone: "violet",
    description: "Оснащён GPS-трекером для безопасности и поддержки споров.",
  },
  "tourist-safe": {
    label: "Безопасно для туристов",
    icon: Globe,
    tone: "teal",
    description: "Хост принимает иностранных водителей и говорит по-английски.",
  },
  "premium-owner": {
    label: "Премиум-хост",
    icon: Crown,
    tone: "amber",
    description: "Топ-хост со стабильной историей 5★ оценок.",
  },
  "english-owner": {
    label: "Хост говорит по-английски",
    icon: Languages,
    tone: "neutral",
    description: "Владелец свободно говорит по-английски.",
  },
  insurance: {
    label: "Страховка",
    icon: ShieldCheck,
    tone: "emerald",
    description: "Авто застраховано партнёром на период поездки.",
  },
  "four-wd": {
    label: "4x4",
    icon: Compass,
    tone: "rose",
    description: "Полный привод с понижающей передачей.",
  },
};

export const TONE_CLASSES: Record<BadgeMeta["tone"], string> = {
  emerald:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60",
  amber:
    "bg-amber-50 text-amber-800 ring-1 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  sky: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  violet:
    "bg-violet-50 text-violet-700 ring-1 ring-violet-200/60 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60",
  neutral:
    "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/60 dark:bg-zinc-900/40 dark:text-zinc-300 dark:ring-zinc-800",
  rose: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  teal: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900/60",
};
