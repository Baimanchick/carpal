import { getTranslations } from "@/i18n/server";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import { SiteHeaderActions } from "@/components/layout/site-header-actions";

const NAV: { label: string; href: string }[] = [
  { label: "Найти машину", href: "/cars" },
  { label: "Маршруты", href: "/routes" },
  { label: "Карта безопасности", href: "/map" },
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
        <SiteHeaderActions navItems={NAV} />
      </div>
    </header>
  );
}
