"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "@/i18n/client";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT_LABELS,
  type Locale,
} from "@/i18n/config";
import { setLocale } from "@/i18n/actions";

export function LocaleSwitcher() {
  const t = useTranslations();
  const current = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  function pick(next: Locale) {
    if (next === current) return;
    startTransition(() => {
      setLocale(next);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="hidden sm:flex"
        >
          <Globe className="size-4" />
          {LOCALE_SHORT_LABELS[current]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t("Язык")}
        </DropdownMenuLabel>
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => pick(locale)}
            className="flex items-center justify-between"
          >
            <span>{LOCALE_LABELS[locale]}</span>
            {locale === current ? <Check className="size-3.5" /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t("Валюта")}
        </DropdownMenuLabel>
        <DropdownMenuItem disabled>USD ($)</DropdownMenuItem>
        <DropdownMenuItem disabled>KGS (с)</DropdownMenuItem>
        <DropdownMenuItem disabled>USDT</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
