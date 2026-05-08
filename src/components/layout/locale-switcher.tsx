"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "@/i18n/client";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT_LABELS,
  type Locale,
} from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations();
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function pick(next: Locale) {
    if (next === current) return;

    startTransition(() => {
      const query = searchParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        locale: next,
      });
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
