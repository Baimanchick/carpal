import Link from "next/link";
import { Camera, Send, Bird } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandMark } from "@/components/layout/brand-mark";

const SECTIONS: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Маркетплейс",
      links: [
        { label: "Найти машину", href: "/cars" },
        { label: "Популярные маршруты", href: "/routes" },
        { label: "Стать хостом", href: "/host" },
        { label: "Подарочная карта", href: "#" },
      ],
    },
    {
      title: "Доверие и безопасность",
      links: [
        { label: "Как работает эскроу", href: "#" },
        { label: "Страховка", href: "#" },
        { label: "GPS и SOS", href: "#" },
        { label: "Споры", href: "#" },
      ],
    },
    {
      title: "Вождение в Кыргызстане",
      links: [
        { label: "Краткий гид по ПДД", href: "/guide" },
        { label: "Горное вождение", href: "/guide/mountain" },
        { label: "Вождение ночью", href: "/guide/night" },
        { label: "Курс Joldo", href: "/guide/joldo" },
      ],
    },
    {
      title: "О нас",
      links: [
        { label: "О CarPal", href: "#" },
        { label: "Пресса", href: "#" },
        { label: "Карьера", href: "#" },
        { label: "Контакты", href: "#" },
      ],
    },
  ];

export async function SiteFooter() {
  const t = await getTranslations();
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_3fr]">
          <div className="space-y-4">
            <BrandMark size="md" textClassName="text-base" />
            <p className="max-w-sm text-sm text-muted-foreground">
              {t(
                "Безопасный peer-to-peer маркетплейс аренды авто для путешественников по Кыргызстану. Проверенные машины, эскроу-платежи, горные хосты.",
              )}
            </p>
            <div className="flex gap-2 text-muted-foreground">
              <Link
                href="#"
                className="grid size-9 place-items-center rounded-md border border-border hover:bg-muted hover:text-foreground"
                aria-label="Instagram"
              >
                <Camera className="size-4" />
              </Link>
              <Link
                href="#"
                className="grid size-9 place-items-center rounded-md border border-border hover:bg-muted hover:text-foreground"
                aria-label="Telegram"
              >
                <Send className="size-4" />
              </Link>
              <Link
                href="#"
                className="grid size-9 place-items-center rounded-md border border-border hover:bg-muted hover:text-foreground"
                aria-label="Twitter / X"
              >
                <Bird className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold">{t(section.title)}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-foreground">
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CarPal. {t("Все права защищены.")}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="hover:text-foreground">
              {t("Условия")}
            </Link>
            <Link href="#" className="hover:text-foreground">
              {t("Конфиденциальность")}
            </Link>
            <Link href="#" className="hover:text-foreground">
              {t("Cookies")}
            </Link>
            <Link href="#" className="hover:text-foreground">
              {t("Импрессум")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
