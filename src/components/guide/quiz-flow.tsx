"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/i18n/client";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Trophy,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RoadReadyBadge } from "./road-ready-badge";

interface Question {
  q: string;
  options: string[];
  answerIndex: number;
  explainer: string;
}

const QUESTIONS: Question[] = [
  {
    q: "Какой скоростной лимит на трассах Кыргызстана?",
    options: ["80 км/ч", "90 км/ч", "110 км/ч", "130 км/ч"],
    answerIndex: 2,
    explainer: "На трассах — 110 км/ч. В городе 60, на загородных 90.",
  },
  {
    q: "Длинный спуск в горах. Как правильно?",
    options: [
      "Перейти в нейтраль и ехать накатом",
      "Постоянно держать тормоз",
      "Тормозить двигателем на 2 или 3 + короткие пульсации тормоза",
      "Включить круиз-контроль",
    ],
    answerIndex: 2,
    explainer:
      "Торможение двигателем + короткие пульсации тормоза предотвращают перегрев. Никогда не катитесь в нейтрали.",
  },
  {
    q: "Стадо овец переходит дорогу. Что делать?",
    options: [
      "Сигналить, чтобы быстрее ушли",
      "Сбавить до пешеходной и пропустить",
      "Въехать в стадо, чтобы пробиться",
      "Развернуться и искать объезд",
    ],
    answerIndex: 1,
    explainer:
      "Сбросить скорость, не сигналить. Пастух покажет, когда можно проезжать.",
  },
  {
    q: "Когда CarPal НЕ советует ехать вне Бишкека?",
    options: [
      "После 18:00",
      "До 06:00",
      "В тумане",
      "Всё перечисленное",
    ],
    answerIndex: 3,
    explainer:
      "Ночь, раннее утро и туман резко повышают риск. Планируйте быть на месте до заката.",
  },
  {
    q: "ГАИ остановило. Чего НЕ должно быть в стандартном пакете документов?",
    options: [
      "Паспорт",
      "Международные права",
      "Свидетельство о рождении",
      "Тех-паспорт",
    ],
    answerIndex: 2,
    explainer:
      "Свидетельство о рождении не нужно. Берите паспорт, IDP + национальные права, СТС, страховку, договор аренды.",
  },
  {
    q: "Небольшое ДТП. Что делать ПЕРВЫМ?",
    options: [
      "Откатить машины с проезжей части",
      "Остановиться, проверить пострадавших, набрать 103 при ранении",
      "Звонить в страховую дома",
      "Ехать в ближайшее отделение полиции",
    ],
    answerIndex: 1,
    explainer:
      "Сначала пострадавшие, потом экстренные службы. Не двигайте машины до фотофиксации.",
  },
  {
    q: "Глубокий брод на грунтовке. Как поступить?",
    options: [
      "Влететь на скорости, чтобы проскочить",
      "Сначала пройти пешком и измерить, потом проехать ровно и медленно",
      "Включить 2WD для сцепления",
      "Не ехать — искать объезд",
    ],
    answerIndex: 1,
    explainer:
      "Сначала всегда проверяем глубину пешком. Едем ровно на пониженной 4x4. Не в одиночку — дождитесь второй машины.",
  },
  {
    q: "Допустимый промилле для водителей в КР?",
    options: ["0.5 ‰", "0.3 ‰", "0.0 ‰ (нулевая толерантность)", "0.8 ‰"],
    answerIndex: 2,
    explainer:
      "Нулевая толерантность. Даже одно пиво накануне может превысить лимит.",
  },
  {
    q: "Однополосная горная дорога — у кого приоритет?",
    options: [
      "У того, кто крупнее",
      "У спускающегося",
      "У поднимающегося",
      "У того, кто первый просигналит",
    ],
    answerIndex: 2,
    explainer:
      "Приоритет у поднимающегося. Спускающийся отъезжает — ему проще тронуться вниз.",
  },
  {
    q: "В машине CarPal есть GPS. Когда он активен?",
    options: [
      "Постоянно",
      "Только по запросу хоста",
      "Только во время поездки — данные доступны вам после",
      "Только ночью",
    ],
    answerIndex: 2,
    explainer:
      "GPS работает только во время вашей поездки. После возврата — отключается. Данные поездки всегда доступны вам.",
  },
];

export function QuizFlow() {
  const t = useTranslations();
  const [step, setStep] = useState<"intro" | number | "result">("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const total = QUESTIONS.length;
  const score = Object.entries(answers).reduce(
    (sum, [k, v]) => sum + (QUESTIONS[+k].answerIndex === v ? 1 : 0),
    0,
  );

  if (step === "intro") return <Intro onStart={() => setStep(0)} />;
  if (step === "result")
    return (
      <Result
        score={score}
        total={total}
        onRetry={() => {
          setAnswers({});
          setStep(0);
        }}
      />
    );

  const current = step as number;
  const question = QUESTIONS[current];
  const selected = answers[current];

  function selectOption(i: number) {
    setAnswers({ ...answers, [current]: i });
  }

  function next() {
    if (current === total - 1) setStep("result");
    else setStep(current + 1);
  }

  function back() {
    if (current === 0) setStep("intro");
    else setStep(current - 1);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold tabular-nums text-muted-foreground">
          {t("Вопрос {current} из {total}", {
            current: current + 1,
            total,
          })}
        </span>
        <span className="text-muted-foreground">
          {t("Сейчас счёт:")}{" "}
          <strong className="text-foreground tabular-nums">{score}</strong>
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-foreground transition-all"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
        {t(question.q)}
      </h2>

      <ul className="mt-5 space-y-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.answerIndex;
          const showFeedback = selected !== undefined;
          return (
            <li key={opt}>
              <button
                type="button"
                onClick={() => selectOption(i)}
                disabled={selected !== undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left text-sm transition-colors",
                  isSelected && !showFeedback && "border-foreground",
                  showFeedback &&
                    isCorrect &&
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                  showFeedback &&
                    isSelected &&
                    !isCorrect &&
                    "border-rose-500 bg-rose-50 dark:bg-rose-950/30",
                  !showFeedback &&
                    !isSelected &&
                    "border-border hover:border-foreground/40",
                  showFeedback &&
                    !isSelected &&
                    !isCorrect &&
                    "border-border opacity-60",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border-2 text-[10px] font-semibold",
                    showFeedback &&
                      isCorrect &&
                      "border-emerald-500 bg-emerald-500 text-background",
                    showFeedback &&
                      isSelected &&
                      !isCorrect &&
                      "border-rose-500 bg-rose-500 text-background",
                    !showFeedback && "border-foreground/30",
                  )}
                >
                  {showFeedback && isCorrect ? (
                    <Check className="size-3.5" />
                  ) : showFeedback && isSelected && !isCorrect ? (
                    <X className="size-3.5" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="flex-1">{t(opt)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected !== undefined ? (
        <div
          className={cn(
            "mt-4 rounded-xl border p-4 text-sm",
            selected === question.answerIndex
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
              : "border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/30",
          )}
        >
          <p className="font-semibold">
            {selected === question.answerIndex
              ? t("Верно!")
              : t("Не совсем.")}
          </p>
          <p className="mt-1 text-muted-foreground">{t(question.explainer)}</p>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={back}>
          <ArrowLeft className="size-4" /> {t("Назад")}
        </Button>
        <Button
          onClick={next}
          disabled={selected === undefined}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {current === total - 1 ? t("Посмотреть результат") : t("Далее")}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-2xl text-center">
      <RoadReadyBadge size="lg" earned={false} className="mx-auto" />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("Заработайте бейдж Road Ready")}
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        {t(
          "10 вопросов про горное вождение, ночь, скот, ДПС и ЧС. Сдайте 8/10 или лучше — получите бейдж.",
        )}
      </p>

      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
        {[
          "Залог −20% на каждую поездку CarPal",
          "Скидка 10% на все страховки",
          "Виден хостам в вашем профиле",
          "Навсегда — пересдавать не нужно",
        ].map((b) => (
          <li
            key={b}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
          >
            <Check className="size-4 text-emerald-600" />
            {t(b)}
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        onClick={onStart}
        className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90"
      >
        {t("Начать квиз")} <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

function Result({
  score,
  total,
  onRetry,
}: {
  score: number;
  total: number;
  onRetry: () => void;
}) {
  const t = useTranslations();
  const passed = score >= 8;

  return (
    <div className="mx-auto max-w-2xl text-center">
      {passed ? (
        <>
          <RoadReadyBadge size="lg" earned className="mx-auto" />
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Trophy className="size-3.5" />
            {t("Бейдж получен")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("Вы готовы к дороге!")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {t("Ваш счёт")}{" "}
            <strong className="text-foreground">
              {score}/{total}
            </strong>
            . {t("Бонусы активны для каждой поездки.")}
          </p>
        </>
      ) : (
        <>
          <RoadReadyBadge size="lg" earned={false} className="mx-auto" />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("Почти получилось")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {t("Ваш счёт")}{" "}
            <strong className="text-foreground">
              {score}/{total}
            </strong>
            . {t("Для бейджа нужно 8 или больше.")}
          </p>
        </>
      )}

      <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 text-xs">
        <Stat label={t("Счёт")} value={`${score}/${total}`} />
        <Stat label={t("Проходной балл")} value="8/10" />
        <Stat label={t("Время")} value={t("~5 мин")} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="lg" onClick={onRetry}>
          <RotateCcw className="size-4" />
          {t("Пройти ещё раз")}
        </Button>
        {passed ? (
          <Button size="lg" variant="outline">
            <Share2 className="size-4" /> {t("Поделиться")}
          </Button>
        ) : null}
        <Link
          href="/cars"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-brand text-brand-foreground hover:bg-brand/90",
          )}
        >
          {t("Найти машину")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold tabular-nums">{value}</p>
    </div>
  );
}
