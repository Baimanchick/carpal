"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@/i18n/client";
import { load } from "@2gis/mapgl";
import {
  Layers,
  Search,
  X,
  Compass,
  TriangleAlert,
  MapPinned,
  Sparkles,
  Shield,
  Eye,
  Fuel,
  Car,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { POIS, KG_CENTER, KG_ZOOM, type Poi, type LayerKind } from "@/lib/mock/map-pois";
import { POI_VISUAL, TONE_BADGE } from "./poi-icons";

const LAYER_META: Record<
  LayerKind,
  { label: string; description: string; icon: typeof Shield; tone: string }
> = {
  safety: {
    label: "Предупреждения",
    description: "Камнепады, нет связи, ночные риски, скот",
    icon: Shield,
    tone: "bg-rose-100 text-rose-700",
  },
  tourist: {
    label: "Туристические места",
    description: "Смотровые, юрточные лагеря, горячие источники, фото-точки",
    icon: Eye,
    tone: "bg-emerald-100 text-emerald-700",
  },
  fuel: {
    label: "Заправки и помощь",
    description: "Заправки, СТО, больницы, полиция, эвакуация",
    icon: Fuel,
    tone: "bg-blue-100 text-blue-700",
  },
  cars: {
    label: "Доступные машины",
    description: "Точки получения авто на CarPal",
    icon: Car,
    tone: "bg-brand-soft text-brand",
  },
};

const POI_EMOJI: Record<Poi["kind"], string> = {
  rockfall: "🪨",
  "no-signal": "📵",
  "night-risk": "🌙",
  livestock: "🐎",
  "sharp-turn": "🌀",
  "no-light": "🕯️",
  "winter-danger": "❄️",
  lookout: "🔭",
  "yurt-camp": "⛺",
  "hot-spring": "♨️",
  "photo-spot": "📸",
  "must-see": "⭐",
  "gas-station": "⛽",
  mechanic: "🔧",
  hospital: "🏥",
  police: "🛡️",
  tow: "🚛",
  pickup: "🚗",
};

export function SafeRouteMap() {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);
  const mapglRef = useRef<unknown>(null);

  const [active, setActive] = useState<Set<LayerKind>>(
    new Set<LayerKind>(["safety", "tourist", "fuel", "cars"]),
  );
  const [selected, setSelected] = useState<Poi | null>(null);
  const [nightMode, setNightMode] = useState(false);

  const filtered = useMemo(
    () => POIS.filter((p) => active.has(p.layer)),
    [active],
  );

  // load + create map once
  useEffect(() => {
    let cancelled = false;
    load().then((mapgl) => {
      if (cancelled || !containerRef.current) return;
      mapglRef.current = mapgl;
      // demo key works on localhost
      const map = new mapgl.Map(containerRef.current, {
        key: "42b5b89c-0d7c-46db-9aa3-cca641962dc6",
        center: KG_CENTER,
        zoom: KG_ZOOM,
      });
      mapRef.current = map;
    });
    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => {
        try {
          (m as { destroy: () => void }).destroy();
        } catch {}
      });
      markersRef.current = [];
      try {
        (mapRef.current as { destroy?: () => void } | null)?.destroy?.();
      } catch {}
      mapRef.current = null;
    };
  }, []);

  // re-render markers when filter changes
  useEffect(() => {
    const mapgl = mapglRef.current as
      | { HtmlMarker: new (m: unknown, opts: unknown) => unknown }
      | null;
    const map = mapRef.current;
    if (!mapgl || !map) return;

    markersRef.current.forEach((m) => {
      try {
        (m as { destroy: () => void }).destroy();
      } catch {}
    });
    markersRef.current = [];

    filtered.forEach((poi) => {
      const visual = POI_VISUAL[poi.kind];
      const emoji = POI_EMOJI[poi.kind] ?? "📍";
      const html = `
        <div data-poi-id="${poi.id}" style="
          background:${visual.pinBg};
          color:${visual.pinFg};
          width:34px;height:34px;border-radius:50%;
          display:grid;place-items:center;
          font-size:16px;line-height:1;
          box-shadow:0 4px 12px rgba(0,0,0,.18), 0 0 0 3px #ffffff;
          cursor:pointer;
          transform:translate(-50%,-100%);
          position:relative;
        ">
          ${emoji}
          <span style="
            position:absolute;left:50%;top:100%;
            width:0;height:0;
            border-left:5px solid transparent;
            border-right:5px solid transparent;
            border-top:6px solid ${visual.pinBg};
            transform:translate(-50%,-1px);
          "></span>
        </div>`;

      const marker = new mapgl.HtmlMarker(map, {
        coordinates: poi.coordinates,
        html,
        anchor: [0, 0],
      }) as { on?: (event: string, fn: () => void) => void };
      marker.on?.("click", () => setSelected(poi));
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => {
        try {
          (m as { destroy: () => void }).destroy();
        } catch {}
      });
      markersRef.current = [];
    };
  }, [filtered]);

  function toggleLayer(layer: LayerKind) {
    const next = new Set(active);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    setActive(next);
  }

  function flyTo(coords: [number, number]) {
    const map = mapRef.current as
      | { setCenter: (c: number[]) => void; setZoom: (z: number) => void }
      | null;
    if (!map) return;
    map.setCenter(coords);
    map.setZoom(11);
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Map container */}
      <div ref={containerRef} className="absolute inset-0 bg-muted" />

      {/* night-mode dim overlay (UX flair) */}
      {nightMode ? (
        <div className="pointer-events-none absolute inset-0 bg-indigo-950/30 mix-blend-multiply" />
      ) : null}

      {/* Top-left: search + title */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-start gap-3 sm:right-auto">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl bg-background/95 p-2 pl-3 shadow-lg ring-1 ring-foreground/5 backdrop-blur sm:w-80">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder={t("Найти место, город, маршрут…")}
            className="h-7 flex-1 bg-transparent text-sm outline-none"
          />
          <Button size="sm" className="h-7 px-3">
            {t("Поиск")}
          </Button>
        </div>

        <div className="hidden items-center gap-2 rounded-2xl bg-background/95 px-3 py-2 text-xs shadow-lg ring-1 ring-foreground/5 backdrop-blur sm:flex">
          <MapPinned className="size-3.5 text-brand" />
          <span className="font-semibold">{t("Кыргызстан")}</span>
          <span className="text-muted-foreground">
            · {filtered.length} {t("точек")}
          </span>
        </div>
      </div>

      {/* Top-right: layer toggles */}
      <div className="absolute top-4 right-4 hidden lg:block">
        <LayerPanel
          active={active}
          onToggle={toggleLayer}
          nightMode={nightMode}
          setNightMode={setNightMode}
        />
      </div>

      {/* Mobile filter button */}
      <div className="absolute top-4 right-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="size-10 rounded-full bg-background text-foreground shadow-lg ring-1 ring-foreground/5 hover:bg-background">
              <Layers className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>{t("Слои карты")}</SheetTitle>
            </SheetHeader>
            <div className="px-4">
              <LayerPanel
                active={active}
                onToggle={toggleLayer}
                nightMode={nightMode}
                setNightMode={setNightMode}
                bare
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom: legend */}
      <div className="absolute bottom-4 right-4 hidden max-w-xs rounded-2xl bg-background/95 p-3 text-xs shadow-lg ring-1 ring-foreground/5 backdrop-blur md:block">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("Легенда")}
        </p>
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
          {(
            [
              "rockfall",
              "night-risk",
              "livestock",
              "yurt-camp",
              "hot-spring",
              "must-see",
              "gas-station",
              "mechanic",
              "pickup",
            ] as const
          ).map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span
                className="grid size-5 place-items-center rounded-full text-[12px] leading-none ring-2 ring-background"
                style={{ background: POI_VISUAL[k].pinBg }}
              >
                {POI_EMOJI[k]}
              </span>
              <span className="capitalize">{t(POI_VISUAL[k].categoryLabel)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right (or bottom on mobile): selected POI card */}
      {selected ? (
        <div className="absolute bottom-4 left-1/2 z-20 w-[min(92vw,28rem)] -translate-x-1/2 sm:bottom-6 sm:left-4 sm:translate-x-0">
          <PoiCard
            poi={selected}
            onClose={() => setSelected(null)}
            onFlyTo={() => flyTo(selected.coordinates)}
          />
        </div>
      ) : null}

      {nightMode ? (
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 rounded-full bg-indigo-950/90 px-3 py-1.5 text-[11px] font-semibold text-indigo-50 shadow-lg ring-1 ring-indigo-300/30">
          🌙 {t("Безопасный ночной режим — после 18:00 избегайте красных и фиолетовых зон")}
        </div>
      ) : null}
    </div>
  );
}

function LayerPanel({
  active,
  onToggle,
  nightMode,
  setNightMode,
  bare,
}: {
  active: Set<LayerKind>;
  onToggle: (layer: LayerKind) => void;
  nightMode: boolean;
  setNightMode: (v: boolean) => void;
  bare?: boolean;
}) {
  const t = useTranslations();
  return (
    <div
      className={cn(
        !bare &&
          "w-72 rounded-2xl bg-background/95 p-4 shadow-lg ring-1 ring-foreground/5 backdrop-blur",
      )}
    >
      <div className="flex items-center gap-2">
        <Layers className="size-4" />
        <p className="text-sm font-semibold">{t("Слои карты")}</p>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {t("Выберите, что показать на карте.")}
      </p>
      <ul className="mt-3 space-y-2">
        {(Object.keys(LAYER_META) as LayerKind[]).map((key) => {
          const meta = LAYER_META[key];
          const isOn = active.has(key);
          const Icon = meta.icon;
          return (
            <li
              key={key}
              className="flex items-start gap-3 rounded-xl border border-border bg-background p-3"
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg",
                  meta.tone,
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t(meta.label)}</p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {t(meta.description)}
                </p>
              </div>
              <Switch
                checked={isOn}
                onCheckedChange={() => onToggle(key)}
                size="sm"
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/60 dark:bg-indigo-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-indigo-600 text-background">
              🌙
            </span>
            <div>
              <p className="text-sm font-semibold">
                {t("Безопасный ночной режим")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t("Выделять опасные зоны после 18:00")}
              </p>
            </div>
          </div>
          <Switch
            checked={nightMode}
            onCheckedChange={setNightMode}
            size="sm"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-[11px] text-muted-foreground">
        <p className="inline-flex items-center gap-1.5 font-semibold text-foreground">
          <Sparkles className="size-3.5" />
          {t("AI-планировщик маршрута")}
        </p>
        <p className="mt-1">
          {t(
            "Скажите даты и уровень комфорта — мы построим безопасный маршрут, подберём авто и подсветим ночные риски.",
          )}
        </p>
        <Button size="xs" variant="outline" className="mt-2">
          {t("Спланировать маршрут")}
        </Button>
      </div>
    </div>
  );
}

function PoiCard({
  poi,
  onClose,
  onFlyTo,
}: {
  poi: Poi;
  onClose: () => void;
  onFlyTo: () => void;
}) {
  const t = useTranslations();
  const visual = POI_VISUAL[poi.kind];
  const Icon = visual.icon;
  const meta = LAYER_META[poi.layer];

  const severityLabel: Record<string, string> = {
    high: "высокий риск",
    medium: "средний риск",
    low: "низкий риск",
  };

  return (
    <div className="relative rounded-2xl border border-border bg-background p-4 shadow-2xl ring-1 ring-foreground/5">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-start gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-xl text-background"
          style={{ background: visual.pinBg }}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1 pr-7">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                TONE_BADGE[visual.tone],
              )}
            >
              {t(visual.categoryLabel)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              · {t(meta.label)}
            </span>
            {poi.severity ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  poi.severity === "high"
                    ? "bg-rose-100 text-rose-700"
                    : poi.severity === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700",
                )}
              >
                {t(severityLabel[poi.severity] ?? poi.severity)}
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 text-base font-semibold tracking-tight">
            {t(poi.title)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(poi.description)}
          </p>
          {poi.reporter ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("Сообщил: {reporter}", { reporter: poi.reporter })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        <Button size="sm" variant="outline" onClick={onFlyTo}>
          <Compass className="size-3.5" /> {t("Центрировать на карте")}
        </Button>
        {poi.layer === "safety" ? (
          <Button size="sm" variant="outline">
            <TriangleAlert className="size-3.5" /> {t("Сообщить об обновлении")}
          </Button>
        ) : null}
        {poi.layer === "cars" ? (
          <Button
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {t("Открыть машину")}
          </Button>
        ) : null}
        <span className="ml-auto self-center text-[11px] text-muted-foreground">
          {poi.coordinates[1].toFixed(4)}, {poi.coordinates[0].toFixed(4)}
        </span>
      </div>
    </div>
  );
}

