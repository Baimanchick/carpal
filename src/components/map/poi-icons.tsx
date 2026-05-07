import {
  TriangleAlert,
  WifiOff,
  Moon,
  PawPrint,
  Compass,
  Snowflake,
  Eye,
  Tent,
  Bath,
  Camera,
  Star,
  Fuel,
  Wrench,
  Hospital,
  Shield,
  Truck,
  Car,
  type LucideIcon,
} from "lucide-react";
import type { Poi } from "@/lib/mock/map-pois";

type Tone =
  | "rose"
  | "amber"
  | "blue"
  | "emerald"
  | "violet"
  | "sky"
  | "neutral"
  | "teal"
  | "brand";

export interface PoiVisual {
  icon: LucideIcon;
  tone: Tone;
  pinBg: string;
  pinFg: string;
  categoryLabel: string;
}

export const POI_VISUAL: Record<Poi["kind"], PoiVisual> = {
  rockfall: { icon: TriangleAlert, tone: "rose", pinBg: "#dc2626", pinFg: "#fff", categoryLabel: "Камнепад" },
  "no-signal": { icon: WifiOff, tone: "neutral", pinBg: "#475569", pinFg: "#fff", categoryLabel: "Нет связи" },
  "night-risk": { icon: Moon, tone: "violet", pinBg: "#6d28d9", pinFg: "#fff", categoryLabel: "Ночной риск" },
  livestock: { icon: PawPrint, tone: "amber", pinBg: "#d97706", pinFg: "#fff", categoryLabel: "Скот" },
  "sharp-turn": { icon: Compass, tone: "amber", pinBg: "#f59e0b", pinFg: "#fff", categoryLabel: "Резкие повороты" },
  "no-light": { icon: Moon, tone: "violet", pinBg: "#5b21b6", pinFg: "#fff", categoryLabel: "Нет освещения" },
  "winter-danger": { icon: Snowflake, tone: "sky", pinBg: "#0284c7", pinFg: "#fff", categoryLabel: "Зимняя опасность" },
  lookout: { icon: Eye, tone: "emerald", pinBg: "#10b981", pinFg: "#fff", categoryLabel: "Смотровая" },
  "yurt-camp": { icon: Tent, tone: "emerald", pinBg: "#059669", pinFg: "#fff", categoryLabel: "Юрточный лагерь" },
  "hot-spring": { icon: Bath, tone: "teal", pinBg: "#0d9488", pinFg: "#fff", categoryLabel: "Горячий источник" },
  "photo-spot": { icon: Camera, tone: "emerald", pinBg: "#16a34a", pinFg: "#fff", categoryLabel: "Фото-точка" },
  "must-see": { icon: Star, tone: "emerald", pinBg: "#15803d", pinFg: "#fff", categoryLabel: "Обязательно посетить" },
  "gas-station": { icon: Fuel, tone: "blue", pinBg: "#2563eb", pinFg: "#fff", categoryLabel: "Заправка" },
  mechanic: { icon: Wrench, tone: "blue", pinBg: "#1d4ed8", pinFg: "#fff", categoryLabel: "СТО" },
  hospital: { icon: Hospital, tone: "rose", pinBg: "#e11d48", pinFg: "#fff", categoryLabel: "Больница" },
  police: { icon: Shield, tone: "neutral", pinBg: "#1f2937", pinFg: "#fff", categoryLabel: "Полиция" },
  tow: { icon: Truck, tone: "blue", pinBg: "#1e40af", pinFg: "#fff", categoryLabel: "Эвакуатор" },
  pickup: { icon: Car, tone: "brand", pinBg: "#dc2626", pinFg: "#fff", categoryLabel: "Доступная машина" },
};

export const TONE_BADGE: Record<Tone, string> = {
  rose: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/60",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
  emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  violet: "bg-violet-50 text-violet-700 ring-1 ring-violet-200/60",
  sky: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60",
  neutral: "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/60",
  teal: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/60",
  brand: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
};
