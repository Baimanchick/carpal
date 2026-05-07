import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  GraduationCap,
  Lightbulb,
  TriangleAlert,
  X,
} from "lucide-react";
import { getTranslations } from "@/i18n/server";
import { useTranslations } from "@/i18n/client";
import { buttonVariants } from "@/components/ui/button";
import { LESSONS, getLesson, getNextLesson } from "@/lib/guide-content";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Урок не найден" };
  return {
    title: lesson.title,
    description: lesson.intro,
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const next = getNextLesson(slug);
  const t = await getTranslations();
  const Icon = lesson.icon;

  return (
    <div className="bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/guide"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> {t("Назад к гиду водителя")}
        </Link>

        <header className="mt-4 space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold text-brand">
            <span className="grid size-5 place-items-center rounded-full bg-brand text-brand-foreground">
              <Icon className="size-3" />
            </span>
            {t(lesson.category)}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t(lesson.title)}
          </h1>
          <p className="text-base text-muted-foreground">{t(lesson.intro)}</p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {lesson.minutes} {t("мин чтения")}
          </p>
        </header>

        <div className="mt-8 grid aspect-[16/9] place-items-center rounded-2xl bg-gradient-to-br from-foreground to-zinc-700 text-background">
          <div className="text-center">
            <Icon className="mx-auto size-10 opacity-90" />
            <p className="mt-2 text-sm font-semibold">
              {t("Иллюстрация урока")}
            </p>
            <p className="text-xs text-background/70">
              {t("Видео и инфографика появятся скоро")}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-base leading-relaxed">
          {lesson.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                <GraduationCap className="size-3.5" />
                {t("Заработать бейдж Road Ready")}
              </p>
              <h3 className="mt-1 text-base font-semibold">
                {t("Пройдите квиз из 10 вопросов")}
              </h3>
              <p className="mt-1 text-sm text-amber-900/80 dark:text-amber-100/80">
                {t("Снижает залог на 20% и даёт скидку 10% на страховку.")}
              </p>
            </div>
            <Link
              href="/guide/quiz"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-amber-600 text-amber-50 hover:bg-amber-600/90",
              )}
            >
              {t("Пройти квиз")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {next ? (
          <Link
            href={`/guide/${next.slug}`}
            className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/40"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("Далее")}
              </p>
              <p className="mt-1 text-base font-semibold">{t(next.title)}</p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground" />
          </Link>
        ) : null}
      </article>
    </div>
  );
}

function Block({
  block,
}: {
  block: import("@/lib/guide-content").ContentBlock;
}) {
  const t = useTranslations();
  if (block.type === "h")
    return (
      <h2 className="text-xl font-semibold tracking-tight">{t(block.text)}</h2>
    );
  if (block.type === "p") return <p>{t(block.text)}</p>;

  if (block.type === "do" || block.type === "dont") {
    const isDo = block.type === "do";
    return (
      <div
        className={cn(
          "rounded-2xl border p-4",
          isDo
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
            : "border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/30",
        )}
      >
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-wider",
            isDo ? "text-emerald-700" : "text-rose-700",
          )}
        >
          {isDo ? t("Делайте") : t("Не делайте")}
        </p>
        <ul className="space-y-2 text-sm">
          {block.items.map((it) => (
            <li key={it} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-[10px] font-bold text-background",
                  isDo ? "bg-emerald-500" : "bg-rose-500",
                )}
              >
                {isDo ? (
                  <Check className="size-2.5" />
                ) : (
                  <X className="size-2.5" />
                )}
              </span>
              {t(it)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === "tip") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-blue-500 text-background">
            <Lightbulb className="size-3.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {t(block.title)}
            </p>
            <p className="mt-1 text-sm text-blue-900/85 dark:text-blue-100/85">
              {t(block.text)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "warning") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-amber-500 text-background">
            <TriangleAlert className="size-3.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              {t(block.title)}
            </p>
            <p className="mt-1 text-sm text-amber-900/85 dark:text-amber-100/85">
              {t(block.text)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "steps") {
    return (
      <ol className="space-y-3">
        {block.items.map((it, i) => (
          <li
            key={it.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
              {i + 1}
            </span>
            <div>
              <p className="text-base font-semibold">{t(it.title)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t(it.text)}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return null;
}
