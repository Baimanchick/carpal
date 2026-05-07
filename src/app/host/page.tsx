import Link from "next/link";
import { getTranslations } from "@/i18n/server";
import {
  ArrowRight,
  BadgeDollarSign,
  Calendar,
  Shield,
  ShieldCheck,
  Wallet,
  Wrench,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Стать хостом" };

const PERKS = [
  {
    icon: BadgeDollarSign,
    title: "Зарабатывайте $600–$2 400/мес",
    text: "Активные владельцы 4x4 в туристический сезон (май–октябрь).",
  },
  {
    icon: Calendar,
    title: "Календарь — за вами",
    text: "Блокируйте даты. Принимайте или отклоняйте поездки одним тапом.",
  },
  {
    icon: Shield,
    title: "Страховка и эскроу",
    text: "Мы держим залог и решаем споры за вас.",
  },
  {
    icon: Wallet,
    title: "Оплата в USDT",
    text: "Выплаты в KGS на банк или USDT — ежедневные выводы.",
  },
  {
    icon: Wrench,
    title: "Бесплатный тех-осмотр",
    text: "Партнёрский механик осматривает машину перед публикацией.",
  },
  {
    icon: ShieldCheck,
    title: "Субсидия на GPS-трекер",
    text: "−50% на оборудование, бесплатно для Premium-хостов.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Подайте машину",
    text: "Загрузите тех-паспорт, страховку и 8 фото.",
  },
  {
    n: "02",
    title: "Бесплатный осмотр",
    text: "Партнёрский механик осмотрит за 24 часа.",
  },
  {
    n: "03",
    title: "Получите верификацию",
    text: "Документы проверит наша команда.",
  },
  {
    n: "04",
    title: "Запуск и заработок",
    text: "В среднем хост получает первую бронь за 5 дней.",
  },
];

const TIER = [
  {
    name: "Free",
    price: "0% за подключение",
    bullets: [
      "1 машина",
      "Стандартное место в выдаче",
      "Базовая аналитика",
      "Комиссия 20%",
    ],
  },
  {
    name: "Pro",
    price: "$19/мес",
    recommended: true,
    bullets: [
      "До 5 машин",
      "Выше в выдаче",
      "Pro-аналитика",
      "Бейдж Pro в карточках",
      "Субсидия на GPS",
      "Комиссия 15%",
    ],
  },
  {
    name: "Business",
    price: "$59/мес",
    bullets: [
      "Без лимита по парку",
      "Несколько менеджеров",
      "API и экспорт CSV",
      "Приоритетная поддержка",
      "Отчёты и счета-фактуры",
      "Комиссия 12%",
    ],
  },
];

export default async function HostLandingPage() {
  const t = await getTranslations();
  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:url('https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=2400&q=70')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/85 to-foreground" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-medium ring-1 ring-background/20 backdrop-blur">
            <Sparkles className="size-3.5" />
            {t("Для владельцев авто в Кыргызстане")}
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t("Превратите свою машину в")}<br />
            <span className="text-brand">{t("дополнительный доход.")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-background/75 sm:text-lg">
            {t(
              "Присоединяйтесь к 380+ хостам, которые уже зарабатывают на CarPal. Мы берём на себя верификацию, страховку, эскроу и споры — а ключи остаются у вас.",
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/host/onboarding"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
            >
              {t("Начать")} <ArrowRight className="size-4" />
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
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-background/70">
            <span>
              <strong className="text-background">$1.2M</strong>{" "}
              {t("выплачено хостам за последние 12 мес.")}
            </span>
            <span>
              <strong className="text-background">4.91★</strong>{" "}
              {t("средний рейтинг владельцев")}
            </span>
            <span>
              <strong className="text-background">380+</strong>{" "}
              {t("активных хостов")}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("Почему стоит хостить с CarPal")}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{t(title)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(text)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("Как проходит подключение")}
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-border bg-background p-5"
              >
                <span className="text-xs font-semibold tabular-nums text-brand">
                  {s.n}
                </span>
                <h3 className="mt-1 text-base font-semibold">{t(s.title)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(s.text)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("Выберите тариф")}
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {TIER.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-2xl border bg-card p-6",
                tier.recommended
                  ? "border-foreground ring-2 ring-foreground/10"
                  : "border-border",
              )}
            >
              {tier.recommended ? (
                <span className="absolute -top-2 left-4 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">
                  {t("Самый популярный")}
                </span>
              ) : null}
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {tier.name}
              </p>
              <p className="mt-2 text-3xl font-semibold">{t(tier.price)}</p>
              <ul className="mt-5 space-y-1.5 text-sm">
                {tier.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />{" "}
                    {t(b)}
                  </li>
                ))}
              </ul>
              <Link
                href="/host/onboarding"
                className={cn(
                  buttonVariants({
                    variant: tier.recommended ? "default" : "outline",
                    size: "lg",
                  }),
                  "mt-6 w-full",
                )}
              >
                {t("Старт на {plan}", { plan: tier.name })}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
