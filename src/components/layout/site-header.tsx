import Link from "next/link";
import { getTranslations } from "@/i18n/server";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import {
  HeaderAuthControls,
  HeaderAuthMenuItems,
} from "@/features/auth/components/header-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NAV: { label: string; href: string }[] = [
  { label: "Найти машину", href: "/cars" },
  { label: "Маршруты", href: "/routes" },
  { label: "Карта безопасности", href: "/map" },
  { label: "Гид водителя", href: "/guide" },
  { label: "Стать хостом", href: "/host" },
];

export async function SiteHeader() {
  const t = await getTranslations();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <BrandMark size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
              {NAV.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{t(item.label)}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <HeaderAuthMenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
