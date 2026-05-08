"use client";

import { useState, useSyncExternalStore } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import {
  HeaderAuthControls,
  HeaderAuthMenuItems,
} from "@/features/auth/components/header-auth";
import { useTranslations } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import {
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEASER,
  SUPPORT_PHONE_TEL,
} from "@/lib/contacts";

type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderActionsProps = {
  navItems: NavItem[];
};

export function SiteHeaderActions({ navItems }: SiteHeaderActionsProps) {
  const t = useTranslations();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isMounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden h-5 w-32 rounded bg-muted/70 sm:block" />
        <div className="hidden h-7 w-14 rounded-lg bg-muted/70 sm:block" />
        <div className="hidden h-8 w-20 rounded-lg bg-muted/70 sm:block" />
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          disabled
          aria-hidden="true"
          tabIndex={-1}
        >
          <Menu className="size-5" />
          <span className="sr-only">{t("Открыть меню")}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <HeaderPhone />
      <LocaleSwitcher />
      <HeaderAuthControls />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">{t("Открыть меню")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {navItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>{t(item.label)}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={`tel:${SUPPORT_PHONE_TEL}`}>{t("Позвонить")}</a>
          </DropdownMenuItem>
          <HeaderAuthMenuItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function HeaderPhone() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="hidden items-center gap-1.5 text-sm font-medium underline decoration-dashed decoration-brand/60 underline-offset-[6px] transition-colors hover:decoration-brand sm:inline-flex"
        >
          <span className="text-muted-foreground">{SUPPORT_PHONE_TEASER}</span>
          <span className="text-brand">{t("Позвонить")}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-auto p-3">
        <a
          href={`tel:${SUPPORT_PHONE_TEL}`}
          className="flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand"
        >
          <Phone className="size-4 text-brand" />
          {SUPPORT_PHONE}
        </a>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t("Поддержка ежедневно 9:00–21:00")}
        </p>
      </PopoverContent>
    </Popover>
  );
}
