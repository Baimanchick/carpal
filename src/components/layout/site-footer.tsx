import { Mail, Phone, Send } from "lucide-react";
import { getTranslations } from "@/i18n/server";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/layout/brand-mark";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  SUPPORT_TELEGRAM_HANDLE,
  SUPPORT_TELEGRAM_URL,
} from "@/lib/contacts";

const SECTIONS: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Маркетплейс",
      links: [
        { label: "Найти машину", href: "/cars" },
        { label: "Популярные маршруты", href: "/routes" },
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
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${SUPPORT_PHONE_TEL}`}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 text-brand" />
                  {SUPPORT_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={SUPPORT_TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Send className="size-4 text-brand" />
                  Telegram {SUPPORT_TELEGRAM_HANDLE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 text-brand" />
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold">{t(section.title)}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("#") ? (
                        <a href={link.href} className="hover:text-foreground">
                          {t(link.label)}
                        </a>
                      ) : (
                        <Link href={link.href} className="hover:text-foreground">
                          {t(link.label)}
                        </Link>
                      )}
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
            <a href="#" className="hover:text-foreground">
              {t("Условия")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("Конфиденциальность")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("Cookies")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("Импрессум")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
