"use client";

import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/client";
import { cn } from "@/lib/utils";
import type { LeadKind } from "@/features/leads/model/leads.types";

const NEXT_STEP_BY_KIND: Record<LeadKind, string> = {
  tourist:
    "Мы напомним за день до запуска и пришлём ссылку на бесплатные сутки.",
  host: "Свяжемся в течение 1–2 дней — расскажем про подключение и GPS.",
  fleet: "Менеджер свяжется в рабочие часы для обсуждения пилота.",
  partner: "Свяжемся, обсудим формат и приоритетное размещение.",
};

type LeadSuccessProps = {
  leadKind: LeadKind;
  onReset: () => void;
  publicCode: string;
};

export function LeadSuccess({ leadKind, onReset, publicCode }: LeadSuccessProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(publicCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col items-center text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand/10 text-brand">
        <CheckCircle2 className="size-6" />
      </span>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight">
        {t("Готово, мы на связи")}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {t(NEXT_STEP_BY_KIND[leadKind])}
      </p>

      <div
        className={cn(
          "mt-6 inline-flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3",
        )}
      >
        <div className="text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("Код заявки")}
          </p>
          <p className="font-mono text-base tracking-[0.2em] text-foreground">
            {publicCode}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="gap-1.5"
        >
          <Copy className="size-3.5" />
          {copied ? t("Скопировано") : t("Скопировать")}
        </Button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {t("Отправить ещё одну заявку")}
      </button>
    </div>
  );
}
