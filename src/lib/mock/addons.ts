import {
  Tent,
  Wifi,
  Baby,
  Snowflake,
  Compass,
  Phone,
  Plane,
  Hotel,
  Footprints,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react";

export type AddonPricing =
  | { kind: "perDay"; price: number }
  | { kind: "flat"; price: number };

export interface Addon {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  pricing: AddonPricing;
}

export const ADDONS: Addon[] = [
  {
    id: "roof-tent",
    name: "Палатка на крышу",
    description: "Спальное место на крыше машины. На 2 человека.",
    icon: Tent,
    pricing: { kind: "perDay", price: 15 },
  },
  {
    id: "camping-kit",
    name: "Кемпинг-набор",
    description: "Спальники ×2, фонарь, горелка, посуда.",
    icon: Footprints,
    pricing: { kind: "perDay", price: 8 },
  },
  {
    id: "child-seat",
    name: "Детское кресло",
    description: "Группа 1+2+3, 9–36 кг.",
    icon: Baby,
    pricing: { kind: "perDay", price: 3 },
  },
  {
    id: "wifi-router",
    name: "Карманный Wi-Fi",
    description: "Безлимитный 4G по всему Кыргызстану.",
    icon: Wifi,
    pricing: { kind: "perDay", price: 5 },
  },
  {
    id: "winter-kit",
    name: "Зимний набор",
    description: "Цепи, скребок для льда, антифриз.",
    icon: Snowflake,
    pricing: { kind: "perDay", price: 10 },
  },
  {
    id: "gps",
    name: "Оффлайн GPS-навигатор",
    description: "Карты КР, работает без сигнала.",
    icon: Compass,
    pricing: { kind: "perDay", price: 4 },
  },
  {
    id: "sim",
    name: "Местная SIM-карта",
    description: "20 ГБ интернета и KG-номер для экстренных случаев.",
    icon: Phone,
    pricing: { kind: "flat", price: 10 },
  },
  {
    id: "roadside",
    name: "Помощь на дороге",
    description: "Эвакуатор и выездной механик 24/7.",
    icon: ShieldPlus,
    pricing: { kind: "perDay", price: 3 },
  },
  {
    id: "airport",
    name: "Доставка в аэропорт",
    description: "Встреча в аэропортах Манас / Ош.",
    icon: Plane,
    pricing: { kind: "flat", price: 25 },
  },
  {
    id: "hotel",
    name: "Доставка в отель",
    description: "Подача в любой отель в Бишкеке / на Иссык-Куле.",
    icon: Hotel,
    pricing: { kind: "flat", price: 15 },
  },
];
