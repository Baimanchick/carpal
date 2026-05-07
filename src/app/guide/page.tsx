import Link from "next/link";
import {
  Mountain,
  Moon,
  Footprints,
  Car,
  Phone,
  TriangleAlert,
  GraduationCap,
  ArrowRight,
  Languages,
  PawPrint,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Гид водителя для иностранцев" };

const LESSONS = [
  {
    icon: Car,
    title: "ПДД в Кыргызстане",
    desc: "Скоростные лимиты, знаки, отличия от ЕС/США.",
    minutes: 6,
    href: "/guide/traffic-rules",
  },
  {
    icon: Mountain,
    title: "Горные дороги и серпантины",
    desc: "Торможение двигателем, шпильки, когда сбрасывать газ.",
    minutes: 8,
    href: "/guide/mountain",
  },
  {
    icon: Moon,
    title: "Риски ночного вождения",
    desc: "Почему мы не советуем ехать после 18:00 в регионах.",
    minutes: 5,
    href: "/guide/night",
  },
  {
    icon: PawPrint,
    title: "Скот и люди на дорогах",
    desc: "Сбавляйте скорость, не сигнальте. Как объезжать лошадей.",
    minutes: 4,
    href: "/guide/livestock",
  },
  {
    icon: Phone,
    title: "ДПС и документы",
    desc: "Что иметь, что говорить, когда это развод.",
    minutes: 5,
    href: "/guide/police",
  },
  {
    icon: TriangleAlert,
    title: "Что делать при ДТП",
    desc: "Шаг за шагом. Контакты страховой. Фотофиксация.",
    minutes: 7,
    href: "/guide/accident",
  },
  {
    icon: Footprints,
    title: "Бездорожье и грунтовки",
    desc: "Давление в шинах, броды, основы эвакуации.",
    minutes: 6,
    href: "/guide/offroad",
  },
  {
    icon: Languages,
    title: "Фразы для экстренных ситуаций (RU/KG)",
    desc: "20 фраз для аварий, заправок, еды и хостелов.",
    minutes: 3,
    href: "/guide/phrases",
  },
];

const DOS = [
  "Сбавляйте скорость рядом со скотом — он не уступает",
  "Используйте пониженную передачу на длинных спусках",
  "Берите наличные для заправок в регионах",
  "Купите местную SIM (Beeline / O!)",
  "Едьте с включёнными фарами всегда",
];

const DONTS = [
  "Не ездите ночью по Нарыну / южному берегу Иссык-Куля",
  "Не сигнальте рядом с лошадьми и овцами",
  "Не платите «штрафы» на месте — требуйте квитанцию",
  "Не въезжайте в реку, не проверив глубину пешком",
  "Не паркуйтесь на обочине горных дорог",
];

export default async function GuidePage() {
  const t = await getTranslations();
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            <GraduationCap className="size-3.5" />
            {t("В партнёрстве с Joldo KG")}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("Едем по Кыргызстану безопасно.")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t.rich(
              "8 коротких уроков, 1 финальный квиз. Заработайте бейдж <b>Road Ready</b> — хост видит его, залог уменьшается, а страховка идёт со скидкой 10%.",
              {
                b: (chunks) => (
                  <strong className="text-foreground">{chunks}</strong>
                ),
              },
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/guide/quiz"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-brand text-brand-foreground hover:bg-brand/90",
              )}
            >
              {t("Пройти квиз Road Ready")} <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/guide/phrases"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {t("Фразы для экстренных ситуаций →")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight">{t("Уроки")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LESSONS.map(({ icon: Icon, ...l }) => (
            <Link
              key={l.title}
              href={l.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/40"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{t(l.title)}</h3>
              <p className="mt-1 flex-1 text-xs text-muted-foreground leading-relaxed">
                {t(l.desc)}
              </p>
              <p className="mt-3 inline-flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {l.minutes} {t("мин")}
                </span>
                <span className="font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  {t("Читать →")}
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-emerald-700">
              {t("Делайте")}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {DOS.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-background">
                    ✓
                  </span>
                  {t(d)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-rose-700">
              {t("Не делайте")}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {DONTS.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900/60 dark:bg-rose-950/30"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-background">
                    ×
                  </span>
                  {t(d)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
