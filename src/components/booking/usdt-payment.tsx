"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Timer, CircleCheck, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  amountUsd: number;
  onConfirmed?: () => void;
}

const USDT_RATE = 1.0; // 1 USDT ≈ 1 USD
const WALLET_ADDRESS = "TJYrTwAGHK8YourEscrowWalletKgDemoXY12";
const NETWORK = "TRC-20 (TRON)";
const EXPIRY_MIN = 15;

export function UsdtPayment({ amountUsd, onConfirmed }: Props) {
  const t = useTranslations();
  const amount = (amountUsd * USDT_RATE).toFixed(2);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_MIN * 60);
  const [status, setStatus] = useState<"pending" | "confirmed" | "expired">(
    "pending",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status !== "pending") return;
    if (secondsLeft <= 0) {
      setStatus("expired");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, status]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const payUri = `tron:${WALLET_ADDRESS}?amount=${amount}&token=USDT`;

  function copyAddress() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function simulateConfirm() {
    setStatus("confirmed");
    onConfirmed?.();
  }

  return (
    <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
      <div className="grid place-items-center rounded-xl bg-background p-3 ring-1 ring-border">
        <QRCodeSVG
          value={payUri}
          size={156}
          bgColor="#ffffff"
          fgColor="#0a0a0a"
          level="M"
        />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
            {NETWORK}
          </span>
          <StatusPill status={status} mm={mm} ss={ss} />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("Отправьте")}{" "}
          <span className="font-semibold text-foreground">{amount} USDT</span>{" "}
          {t(
            "на эскроу-кошелёк. Средства подтвердятся автоматически и заблокируются до завершения поездки.",
          )}
        </p>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("Адрес кошелька")}
          </p>
          <button
            type="button"
            onClick={copyAddress}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-left text-xs font-mono"
          >
            <span className="truncate">{WALLET_ADDRESS}</span>
            {copied ? (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <CircleCheck className="size-3.5" />
                {t("Скопировано")}
              </span>
            ) : (
              <Copy className="size-3.5 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Field label={t("Сумма")} value={`${amount} USDT`} />
          <Field label={t("Эквивалент")} value={`$${amountUsd.toFixed(2)}`} />
          <Field label={t("Курс")} value="1 USDT ≈ 1.00 USD" />
          <Field label={t("Действительно ещё")} value={`${mm}:${ss}`} />
        </div>

        {status === "pending" ? (
          <Button onClick={simulateConfirm} size="sm" variant="outline">
            <Loader className="size-3.5 animate-spin" /> {t("Симулировать подтверждение")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({
  status,
  mm,
  ss,
}: {
  status: "pending" | "confirmed" | "expired";
  mm: string;
  ss: string;
}) {
  const t = useTranslations();
  if (status === "confirmed")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        <CircleCheck className="size-3" />
        {t("Подтверждено")}
      </span>
    );
  if (status === "expired")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
        {t("Истекло")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
      <Timer className="size-3" />
      {t("Ожидание")} · {mm}:{ss}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-semibold tabular-nums">{value}</p>
    </div>
  );
}
