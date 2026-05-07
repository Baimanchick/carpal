import {
  ShieldOff,
  ShieldCheck,
  Crown,
  type LucideIcon,
} from "lucide-react";

export interface ProtectionPlan {
  id: "minimum" | "standard" | "premium";
  name: string;
  pricePerDay: number;
  deductible: number;
  icon: LucideIcon;
  description: string;
  bullets: { label: string; included: boolean }[];
  recommended?: boolean;
}

export const PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: "minimum",
    name: "Минимум",
    pricePerDay: 0,
    deductible: 3000,
    icon: ShieldOff,
    description: "Минимальное покрытие, требуемое законом КР.",
    bullets: [
      { label: "Ответственность перед третьими лицами", included: true },
      { label: "Повреждения арендованной машины", included: false },
      { label: "Стёкла и шины", included: false },
      { label: "Угон и вандализм", included: false },
    ],
  },
  {
    id: "standard",
    name: "Стандарт",
    pricePerDay: 12,
    deductible: 1000,
    icon: ShieldCheck,
    description:
      "Рекомендуем большинству путешественников. Подходит для гор.",
    bullets: [
      { label: "Ответственность перед третьими лицами", included: true },
      { label: "Повреждения в пределах франшизы", included: true },
      { label: "Стёкла и шины", included: true },
      { label: "Угон и вандализм", included: false },
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Премиум",
    pricePerDay: 25,
    deductible: 0,
    icon: Crown,
    description: "Полное спокойствие. Франшиза $0, покрывается всё.",
    bullets: [
      { label: "Ответственность перед третьими лицами", included: true },
      { label: "Повреждения с франшизой $0", included: true },
      { label: "Стёкла и шины", included: true },
      { label: "Угон и вандализм", included: true },
    ],
  },
];
