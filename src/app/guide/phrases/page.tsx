"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Volume2,
  Bookmark,
  Download,
  Search,
  Headphones,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Phrase {
  source: string;
  ru: string;
  kg: string;
  ruPron: string;
  kgPron: string;
}

const PHRASES: { category: string; items: Phrase[] }[] = [
  {
    category: "Приветствие",
    items: [
      { source: "Здравствуйте / Привет", ru: "Здравствуйте", kg: "Салам", ruPron: "Zdrastvuy-tye", kgPron: "Sa-lam" },
      { source: "Спасибо", ru: "Спасибо", kg: "Рахмат", ruPron: "Spa-see-bo", kgPron: "Rahmat" },
      { source: "Пожалуйста", ru: "Пожалуйста", kg: "Сурайм", ruPron: "Pa-zha-loy-sta", kgPron: "Su-raym" },
      { source: "До свидания", ru: "До свидания", kg: "Көрүшкөнчө", ruPron: "Da svee-dah-nee-ya", kgPron: "Kör-üsh-kön-chö" },
      { source: "Извините", ru: "Извините", kg: "Кечириңиз", ruPron: "Eez-vee-nee-tye", kgPron: "Kech-ee-ree-niz" },
      { source: "Я не говорю на местном языке", ru: "Я не говорю по-русски", kg: "Мен орусча сүйлөбөйм", ruPron: "Ya nye ga-va-ryu pa-rooss-kee", kgPron: "Men o-rus-cha süy-lö-böym" },
    ],
  },
  {
    category: "Экстренные ситуации",
    items: [
      { source: "Помогите!", ru: "Помогите!", kg: "Жардам бериңиз!", ruPron: "Pa-ma-gee-tye", kgPron: "Zhar-dam bee-ree-niz" },
      { source: "Вызовите полицию", ru: "Вызовите полицию", kg: "Полицияны чакырыңыз", ruPron: "Vy-za-vee-tye pa-lee-tsi-yu", kgPron: "Pa-lee-tsi-ya-ny cha-ky-ry-niz" },
      { source: "Вызовите скорую", ru: "Вызовите скорую", kg: "Тез жардам чакырыңыз", ruPron: "Vy-za-vee-tye sko-ru-yu", kgPron: "Tez zhar-dam cha-ky-ry-niz" },
      { source: "У меня ДТП", ru: "У меня авария", kg: "Менде кырсык болду", ruPron: "U mee-nya a-va-ree-ya", kgPron: "Men-de kyr-syk bol-du" },
      { source: "Мне нужна помощь", ru: "Мне нужна помощь", kg: "Мага жардам керек", ruPron: "Mnye noozh-na po-moshch", kgPron: "Ma-ga zhar-dam kye-rek" },
      { source: "Я заблудился", ru: "Я заблудился", kg: "Мен адаштым", ruPron: "Ya za-bloo-dee-l-sya", kgPron: "Men a-dash-tym" },
    ],
  },
  {
    category: "Дорога и машина",
    items: [
      { source: "Где заправка?", ru: "Где заправка?", kg: "Май куюучу станция кайда?", ruPron: "Gdye za-prav-ka", kgPron: "May ku-yu-chu stan-tsi-ya kay-da" },
      { source: "Полный бак, пожалуйста", ru: "Полный бак, пожалуйста", kg: "Толтуруп бериңиз", ruPron: "Pol-ny bak", kgPron: "Tol-tu-rup bee-ree-niz" },
      { source: "У меня сломалась машина", ru: "У меня сломалась машина", kg: "Менин машинам бузулду", ruPron: "U mee-nya sla-ma-las ma-shee-na", kgPron: "Me-nin ma-shee-nam bu-zul-du" },
      { source: "Я арендовал эту машину", ru: "Я арендовал эту машину", kg: "Мен бул машинаны ижарага алдым", ruPron: "Ya a-ryen-da-val e-too ma-shee-noo", kgPron: "Men bul ma-shee-na-ny i-zha-ra-ga al-dym" },
      { source: "Сколько стоит эвакуатор?", ru: "Сколько стоит эвакуатор?", kg: "Эвакуатор канча турат?", ruPron: "Skol-ko sto-it e-va-ku-a-tor", kgPron: "E-va-ku-a-tor kan-cha tu-rat" },
    ],
  },
  {
    category: "Еда и ночлег",
    items: [
      { source: "Сколько стоит?", ru: "Сколько стоит?", kg: "Канча турат?", ruPron: "Skol-ko sto-it", kgPron: "Kan-cha tu-rat" },
      { source: "Я вегетарианец", ru: "Я вегетарианец", kg: "Мен вегетерианчымын", ruPron: "Ya vye-gye-ta-ree-ah-nyets", kgPron: "Men ve-ge-ter-i-an-chy-myn" },
      { source: "Где можно переночевать?", ru: "Где можно переночевать?", kg: "Кайда уктасам болот?", ruPron: "Gdye mozh-no pye-rye-na-chye-vat", kgPron: "Kay-da uk-ta-sam bo-lot" },
    ],
  },
];

export default function PhrasesPage() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("ru");

  const all = PHRASES.flatMap((c) =>
    c.items.map((p) => ({ ...p, category: c.category })),
  );
  const filtered = query
    ? all.filter(
        (p) =>
          p.source.toLowerCase().includes(query.toLowerCase()) ||
          p.ru.toLowerCase().includes(query.toLowerCase()) ||
          p.kg.toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/guide"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> {t("Назад к гиду водителя")}
        </Link>

        <header className="mt-4 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold text-brand">
            <Headphones className="size-3.5" />
            {t("Аудио-разговорник")}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("Фразы для экстренных ситуаций")}
          </h1>
          <p className="text-base text-muted-foreground">
            {t(
              "20 фраз для каждого путешественника. Нажмите на динамик, чтобы услышать родное произношение. Сохраните оффлайн перед дорогой.",
            )}
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 sm:max-w-md">
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder={t("Поиск по фразам…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList variant="line">
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="kg">Кыргызча</TabsTrigger>
            </TabsList>
            <TabsContent value="ru" className="hidden">
              ru
            </TabsContent>
            <TabsContent value="kg" className="hidden">
              kg
            </TabsContent>
          </Tabs>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted"
          >
            <Download className="size-3.5" />
            {t("Сохранить оффлайн")}
          </button>
        </div>

        {filtered ? (
          <ul className="mt-8 space-y-2">
            {filtered.map((p, i) => (
              <PhraseRow
                key={i}
                phrase={p}
                lang={tab as "ru" | "kg"}
                category={p.category}
              />
            ))}
            {!filtered.length ? (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t('Под "{query}" фраз нет.', { query })}
              </p>
            ) : null}
          </ul>
        ) : (
          <div className="mt-8 space-y-8">
            {PHRASES.map((c) => (
              <section key={c.category}>
                <h2 className="text-base font-semibold tracking-tight">
                  {t(c.category)}
                </h2>
                <ul className="mt-3 space-y-2">
                  {c.items.map((p, i) => (
                    <PhraseRow key={i} phrase={p} lang={tab as "ru" | "kg"} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PhraseRow({
  phrase,
  lang,
  category,
}: {
  phrase: Phrase;
  lang: "ru" | "kg";
  category?: string;
}) {
  const t = useTranslations();
  const local = lang === "ru" ? phrase.ru : phrase.kg;
  const pron = lang === "ru" ? phrase.ruPron : phrase.kgPron;

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <button
        type="button"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground transition-colors hover:bg-brand/90"
        onClick={() => {
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            const u = new SpeechSynthesisUtterance(local);
            u.lang = lang === "ru" ? "ru-RU" : "ky-KG";
            window.speechSynthesis.speak(u);
          }
        }}
        aria-label={t("Воспроизвести произношение")}
      >
        <Volume2 className="size-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{t(phrase.source)}</p>
        <p className="mt-0.5 text-base">{local}</p>
        <p className="text-[11px] text-muted-foreground">/{pron}/</p>
        {category ? (
          <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {t(category)}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        aria-label={t("Сохранить")}
      >
        <Bookmark className="size-4" />
      </button>
    </li>
  );
}
