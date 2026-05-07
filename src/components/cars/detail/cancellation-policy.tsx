import { CircleCheck, TriangleAlert, Lock } from "lucide-react";
import { useTranslations } from "@/i18n/client";

export function CancellationPolicy() {
  const t = useTranslations();
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Lock className="size-4 text-brand" />
        <h2 className="text-lg font-semibold tracking-tight">
          {t("Отмена и эскроу")}
        </h2>
      </div>

      <ul className="mt-4 space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <CircleCheck className="mt-0.5 size-4 text-emerald-600" />
          <div>
            <p className="font-semibold">
              {t("Бесплатная отмена за 48 часов и раньше")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Полный возврат из эскроу — без лишних вопросов.")}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 size-4 text-amber-600" />
          <div>
            <p className="font-semibold">
              {t("За 48–24 часа: возврат 50%")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Половина суммы остаётся в качестве компенсации хосту.")}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 size-4 text-rose-600" />
          <div>
            <p className="font-semibold">
              {t("Менее чем за 24 часа: аренда не возвращается, залог возвращается")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Страховка и доп. опции возвращаются автоматически.")}
            </p>
          </div>
        </li>
      </ul>
    </section>
  );
}
