"use client";

import { useState } from "react";
import { useTranslations } from "@/i18n/client";
import { Camera, FileText, PenLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const ITEMS = [
  "Внешний вид — спереди",
  "Внешний вид — сзади",
  "Внешний вид — левый борт",
  "Внешний вид — правый борт",
  "Колёса и резина",
  "Салон — приборная панель",
  "Салон — задние сиденья",
  "Багажник",
  "Уровень топлива",
  "Пробег",
  "Стёкла и фары",
  "Документы (копия паспорта, страховка)",
];

export function PretripChecklist() {
  const t = useTranslations();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [signed, setSigned] = useState(false);

  function toggle(item: string) {
    const next = new Set(done);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setDone(next);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <FileText className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {t("Чек-лист перед поездкой")}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t(
              "При получении вы заполняете его вместе с хостом. Фото и подписи сохраняются как доказательство на случай спора.",
            )}
          </p>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {ITEMS.map((item) => {
          const isDone = done.has(item);
          return (
            <li key={item}>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <Checkbox
                    checked={isDone}
                    onCheckedChange={() => toggle(item)}
                  />
                  {t(item)}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Camera className="size-3" /> {t("Фото")}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3">
        <div className="text-xs text-muted-foreground">
          {t("{done} / {total} пунктов отмечено", {
            done: done.size,
            total: ITEMS.length,
          })}
          {signed ? ` · ${t("подпись подтверждена")}` : ""}
        </div>
        <Button
          size="sm"
          variant={signed ? "outline" : "default"}
          onClick={() => setSigned(!signed)}
        >
          <PenLine className="size-3.5" />
          {signed ? t("Подписано") : t("Подписать на телефоне")}
        </Button>
      </div>
    </section>
  );
}
