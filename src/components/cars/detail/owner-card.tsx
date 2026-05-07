import Image from "next/image";
import { Star, MessageCircle, Languages, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Host } from "@/lib/types";

const LANG_LABEL: Record<"ru" | "kg" | "en", string> = {
  en: "English",
  ru: "Русский",
  kg: "Кыргызча",
};

export function OwnerCard({ host }: { host: Host }) {
  const t = useTranslations();
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <Image
          src={host.avatarUrl}
          alt={host.name}
          width={64}
          height={64}
          unoptimized
          className="size-16 rounded-full bg-muted ring-2 ring-background"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">
              {t("Хост: {name}", { name: host.name })}
            </h3>
            {host.isPro ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                <Crown className="size-3" /> {t("Премиум")}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("С {year} года · {trips} поездок", {
              year: host.joinedYear,
              trips: host.trips,
            })}
          </p>

          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <Stat
              label={t("Рейтинг")}
              value={
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5 fill-foreground text-foreground" />
                  {host.rating.toFixed(2)}
                </span>
              }
            />
            <Stat
              label={t("Ответ")}
              value={`${host.responseRate}%`}
            />
            <Stat label={t("Поездки")} value={host.trips} />
          </div>

          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Languages className="size-3.5" />
            {host.languages.map((l) => LANG_LABEL[l]).join(" · ")}
          </p>

          <Button variant="outline" size="sm" className="mt-4">
            <MessageCircle className="size-4" /> {t("Написать хосту")}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
