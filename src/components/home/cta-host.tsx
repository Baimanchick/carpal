import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Calendar, Shield } from "lucide-react";
import { getTranslations } from "@/i18n/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PERKS: { icon: typeof BadgeDollarSign; title: string; text: string }[] = [
  {
    icon: BadgeDollarSign,
    title: "Зарабатывайте $600–$2 400/мес",
    text: "Среднее у активных владельцев 4x4 в летний сезон.",
  },
  {
    icon: Calendar,
    title: "Календарь — за вами",
    text: "Блокируйте даты в любой момент. Отказывайтесь от поездок, которые вам не нравятся.",
  },
  {
    icon: Shield,
    title: "Страховка и эскроу",
    text: "Мы держим залог и решаем споры за вас.",
  },
];

export async function CtaHost() {
  const t = await getTranslations();
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            {t("Для владельцев")}
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("Превратите машину в дополнительный доход.")}
          </h2>
          <p className="mt-3 max-w-md text-sm text-background/75">
            {t(
              "Станьте хостом CarPal. Мы берём на себя верификацию, оплаты, GPS, страховку и даже споры — а ключи остаются у вас.",
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/host"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
            >
              {t("Стать хостом")} <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/host/calculator"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-background/30 bg-transparent text-background hover:bg-background/10",
              )}
            >
              {t("Оценить заработок")}
            </Link>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex gap-3 rounded-xl bg-background/[0.06] p-4 ring-1 ring-background/10"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground">
                <Icon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{t(title)}</h3>
                <p className="mt-0.5 text-xs text-background/70 leading-relaxed">
                  {t(text)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
