export type LayerKind = "safety" | "tourist" | "fuel" | "cars";

export type SafetyKind =
  | "rockfall"
  | "no-signal"
  | "night-risk"
  | "livestock"
  | "sharp-turn"
  | "no-light"
  | "winter-danger";

export type TouristKind =
  | "lookout"
  | "yurt-camp"
  | "hot-spring"
  | "photo-spot"
  | "must-see";

export type FuelKind =
  | "gas-station"
  | "mechanic"
  | "hospital"
  | "police"
  | "tow";

export interface Poi {
  id: string;
  layer: LayerKind;
  kind: SafetyKind | TouristKind | FuelKind | "pickup";
  title: string;
  description: string;
  coordinates: [number, number];
  reporter?: string;
  severity?: "low" | "medium" | "high";
}

export const POIS: Poi[] = [
  {
    id: "s-1",
    layer: "safety",
    kind: "rockfall",
    title: "Зона камнепадов — перевал Тоо-Ашуу",
    description:
      "Активные камнепады на 92–96 км. Избегайте после дождей. Последний инцидент: 18 апреля.",
    coordinates: [73.6325, 42.4321],
    severity: "high",
    reporter: "Команда CarPal",
  },
  {
    id: "s-2",
    layer: "safety",
    kind: "no-signal",
    title: "Нет связи — Боомское ущелье",
    description:
      "Мёртвая зона 12 км между Токмоком и Балыкчы. Загрузите карты оффлайн.",
    coordinates: [75.4012, 42.6105],
    severity: "medium",
  },
  {
    id: "s-3",
    layer: "safety",
    kind: "night-risk",
    title: "Не ездите ночью — Нарын → Сон-Куль",
    description:
      "Нет освещения 80 км. Дикие животные, повороты, после Кочкора нет заправок.",
    coordinates: [75.6021, 41.5612],
    severity: "high",
  },
  {
    id: "s-4",
    layer: "safety",
    kind: "livestock",
    title: "Скот на дороге — Ат-Башы",
    description:
      "Овцы и лошади регулярно переходят дорогу с 6:00 до 9:00 и с 17:00 до 19:00.",
    coordinates: [75.8021, 41.1721],
    severity: "medium",
  },
  {
    id: "s-5",
    layer: "safety",
    kind: "sharp-turn",
    title: "Резкий серпантин — 33 поворота",
    description: "На спуске 2 передача. Густой туман выше 3 000 м.",
    coordinates: [73.4589, 41.7905],
    severity: "medium",
  },
  {
    id: "s-6",
    layer: "safety",
    kind: "winter-danger",
    title: "Зимнее закрытие — перевал Кара-Кече",
    description: "Закрыт ноябрь–апрель. Цепи нужны в мае–июне.",
    coordinates: [75.2104, 41.9523],
    severity: "high",
  },
  {
    id: "t-1",
    layer: "tourist",
    kind: "must-see",
    title: "Башня Бурана",
    description: "Минарет XI века. Открыто 8:00–20:00. Бесплатная парковка.",
    coordinates: [75.2497, 42.7458],
  },
  {
    id: "t-2",
    layer: "tourist",
    kind: "lookout",
    title: "Вход в нацпарк Ала-Арча",
    description:
      "Вход 80 KGS. Парковка ограничена — приезжайте до 10:00 на выходных.",
    coordinates: [74.4942, 42.5589],
  },
  {
    id: "t-3",
    layer: "tourist",
    kind: "photo-spot",
    title: "Каньон Сказка",
    description: "Красные скалы. Последние 2 км — гравий, желателен высокий клиренс.",
    coordinates: [78.0431, 42.1187],
  },
  {
    id: "t-4",
    layer: "tourist",
    kind: "yurt-camp",
    title: "Юрточный лагерь Сон-Куль · Айгуль",
    description:
      "Проверенный лагерь. $30/ночь с питанием. Связь — в 200 м вверх по холму.",
    coordinates: [75.1325, 41.8401],
  },
  {
    id: "t-5",
    layer: "tourist",
    kind: "hot-spring",
    title: "Горячие источники Алтын-Арашан",
    description: "Открытые ванны. Только 4x4 — дорога тяжёлая.",
    coordinates: [78.6123, 42.5301],
  },
  {
    id: "t-6",
    layer: "tourist",
    kind: "must-see",
    title: "Караван-сарай Таш-Рабат",
    description: "Постоялый двор XV века. Лучшее время — июль–сентябрь.",
    coordinates: [75.2789, 40.8302],
  },
  {
    id: "f-1",
    layer: "fuel",
    kind: "gas-station",
    title: "Газпром — центр Бишкека",
    description: "АИ-92 / АИ-95 / Дизель. Карта + наличные. 24/7.",
    coordinates: [74.5904, 42.8721],
  },
  {
    id: "f-2",
    layer: "fuel",
    kind: "gas-station",
    title: "Sinooil — Каракол",
    description: "Последняя заправка перед Жети-Огуз. АИ-95 бывает не всегда.",
    coordinates: [78.3902, 42.4901],
  },
  {
    id: "f-3",
    layer: "fuel",
    kind: "gas-station",
    title: "Bishkek Petroleum — Нарын",
    description: "Последний надёжный дизель перед Сон-Кулем. Закрыто 22:00–06:00.",
    coordinates: [75.9912, 41.4302],
  },
  {
    id: "f-4",
    layer: "fuel",
    kind: "mechanic",
    title: "AutoTech KG — Чолпон-Ата",
    description: "Проверенный СТО. Говорят на английском. +996 555 12 34 56",
    coordinates: [76.9912, 42.6498],
  },
  {
    id: "f-5",
    layer: "fuel",
    kind: "hospital",
    title: "Областная больница Ош",
    description: "Скорая 24/7. Международный отдел. +996 3222 5 67 89",
    coordinates: [72.7912, 40.5101],
  },
  {
    id: "f-6",
    layer: "fuel",
    kind: "police",
    title: "Пост ГАИ — M41, 240 км",
    description: "Контрольный пост. Имейте паспорт, права, СТС.",
    coordinates: [73.5689, 40.6912],
  },
  {
    id: "f-7",
    layer: "fuel",
    kind: "tow",
    title: "Партнёрский эвакуатор CarPal — Бишкек",
    description:
      "Эвакуация и помощь 24/7. Базово $40 + $1.20/км. На Premium-страховке — бесплатно.",
    coordinates: [74.6101, 42.8512],
  },
  {
    id: "c-1",
    layer: "cars",
    kind: "pickup",
    title: "Toyota Land Cruiser Prado · $110/день",
    description: "Аэропорт Манас · Айбек (4.96★)",
    coordinates: [74.4775, 43.0612],
  },
  {
    id: "c-2",
    layer: "cars",
    kind: "pickup",
    title: "Toyota RAV4 · $75/день",
    description: "Центр Бишкека · Нурзат (4.88★)",
    coordinates: [74.5712, 42.8801],
  },
  {
    id: "c-3",
    layer: "cars",
    kind: "pickup",
    title: "Lada Niva · $38/день",
    description: "Автовокзал Каракола · Эрлан (4.71★)",
    coordinates: [78.3905, 42.4925],
  },
  {
    id: "c-4",
    layer: "cars",
    kind: "pickup",
    title: "Mitsubishi Delica · $95/день",
    description: "Бишкек · Айбек (4.93★)",
    coordinates: [74.5898, 42.8612],
  },
  {
    id: "c-7",
    layer: "cars",
    kind: "pickup",
    title: "Hyundai Tucson · $65/день",
    description: "Аэропорт Ош · Нурзат (4.82★)",
    coordinates: [72.7901, 40.6101],
  },
  {
    id: "c-8",
    layer: "cars",
    kind: "pickup",
    title: "UAZ Patriot · $45/день",
    description: "Город Нарын · Эрлан (4.65★)",
    coordinates: [75.9899, 41.4287],
  },
];

export const KG_CENTER: [number, number] = [74.6, 42.0];
export const KG_ZOOM = 7.2;
