"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { differenceInCalendarDays, format } from "date-fns";
import {
  CalendarDays,
  ChevronRight,
  Star,
  CircleCheck,
  Lock,
  Plane,
  Hotel,
  MapPin,
  CreditCard,
  Banknote,
  Building2,
  Bitcoin,
  Check,
  Crown,
  Clock,
  Mail,
  User,
  IdCard,
  Globe,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";
import { ADDONS, type Addon } from "@/lib/mock/addons";
import { PROTECTION_PLANS, type ProtectionPlan } from "@/lib/mock/protection";
import { PretripChecklist } from "./pretrip-checklist";
import { UsdtPayment } from "./usdt-payment";
import { EscrowProgress, type EscrowStep } from "./escrow-progress";
import type { DateRange } from "react-day-picker";

interface Initial {
  from?: string;
  to?: string;
  insurance?: boolean;
}

interface Props {
  car: Car;
  initial: Initial;
}

const SERVICE_FEE_RATE = 0.12;

type PickupOption = "airport" | "city" | "hotel";

const PICKUP_OPTIONS: {
  id: PickupOption;
  label: string;
  description: string;
  fee: number;
  icon: typeof Plane;
}[] = [
  {
    id: "airport",
    label: "Доставка в аэропорт",
    description: "Манас / Ош — хост встречает вас в зоне прилёта.",
    fee: 25,
    icon: Plane,
  },
  {
    id: "city",
    label: "Получить в городе",
    description: "Бесплатное получение по адресу хоста.",
    fee: 0,
    icon: MapPin,
  },
  {
    id: "hotel",
    label: "Доставка в отель",
    description: "Подача в любой отель в черте города.",
    fee: 15,
    icon: Hotel,
  },
];

export function BookingFlow({ car, initial }: Props) {
  const t = useTranslations();
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (initial.from && initial.to)
      return { from: new Date(initial.from), to: new Date(initial.to) };
    return undefined;
  });
  const [pickup, setPickup] = useState<PickupOption>("city");
  const [protectionId, setProtectionId] = useState<ProtectionPlan["id"]>(
    initial.insurance ? "standard" : "minimum",
  );
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "bank" | "cash" | "usdt"
  >("card");
  const [reserved, setReserved] = useState(false);
  const [escrowStep, setEscrowStep] = useState<EscrowStep>("reserved");

  const days = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return Math.max(1, differenceInCalendarDays(range.to, range.from));
  }, [range]);

  const protection = PROTECTION_PLANS.find((p) => p.id === protectionId)!;
  const pickupOption = PICKUP_OPTIONS.find((p) => p.id === pickup)!;

  const subtotal = car.pricePerDay * days;
  const discount =
    days >= 7 && car.discountWeekly ? subtotal * (car.discountWeekly / 100) : 0;
  const protectionCost = protection.pricePerDay * days;
  const addonsCost = Array.from(addons).reduce((sum, id) => {
    const a = ADDONS.find((x) => x.id === id);
    if (!a) return sum;
    return (
      sum +
      (a.pricing.kind === "perDay" ? a.pricing.price * days : a.pricing.price)
    );
  }, 0);
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const total = Math.max(
    0,
    subtotal -
      discount +
      protectionCost +
      addonsCost +
      pickupOption.fee +
      serviceFee,
  );

  function toggleAddon(id: string) {
    const next = new Set(addons);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setAddons(next);
  }

  function reserve() {
    setReserved(true);
    setEscrowStep("funded");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs car={car} />

        {reserved ? (
          <ReservationConfirmed
            car={car}
            step={escrowStep}
            setStep={setEscrowStep}
          />
        ) : (
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("Подтвердите поездку")}
          </h1>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Section step={1} title={t("Детали поездки")}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left"
                    >
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("Начало поездки")}
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {range?.from
                            ? format(range.from, "EEE, MMM d · 10:00")
                            : t("Выбрать дату")}
                        </p>
                      </div>
                      <CalendarDays className="size-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={range}
                      onSelect={setRange}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("Конец поездки")}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {range?.to
                        ? format(range.to, "EEE, MMM d · 10:00")
                        : t("Выбрать дату")}
                    </p>
                  </div>
                  <CalendarDays className="size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("Получение и возврат")}
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {PICKUP_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = pickup === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setPickup(opt.id)}
                        className={cn(
                          "flex flex-col items-start gap-1.5 rounded-xl border bg-background p-3 text-left transition-colors",
                          active
                            ? "border-foreground ring-2 ring-foreground/10"
                            : "border-border hover:border-foreground/40",
                        )}
                      >
                        <span className="flex w-full items-center justify-between text-xs font-medium">
                          <span className="inline-flex items-center gap-1.5">
                            <Icon className="size-3.5" />
                            {t(opt.label)}
                          </span>
                          <span>
                            {opt.fee === 0 ? t("Бесплатно") : `+$${opt.fee}`}
                          </span>
                        </span>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          {t(opt.description)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <FormField
                  label={t("Имя")}
                  icon={<User className="size-3.5" />}
                  placeholder="John"
                />
                <FormField
                  label={t("Фамилия")}
                  icon={<User className="size-3.5" />}
                  placeholder="Doe"
                />
                <FormField
                  label={t("Email")}
                  icon={<Mail className="size-3.5" />}
                  placeholder="you@example.com"
                />
                <FormField
                  label={t("Телефон")}
                  icon={<Phone />}
                  placeholder="+1 555 123 4567"
                />
                <FormField
                  label={t("Водительское удостоверение")}
                  icon={<IdCard className="size-3.5" />}
                  placeholder="A123-4567-89"
                />
                <FormField
                  label={t("Страна")}
                  icon={<Globe className="size-3.5" />}
                  placeholder={t("Германия")}
                />
              </div>
            </Section>

            <Section step={2} title={t("Выберите защиту")}>
              <div className="grid gap-3 sm:grid-cols-3">
                {PROTECTION_PLANS.map((plan) => {
                  const active = protectionId === plan.id;
                  const Icon = plan.icon;
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      onClick={() => setProtectionId(plan.id)}
                      className={cn(
                        "relative flex flex-col gap-3 rounded-xl border bg-background p-4 text-left transition-colors",
                        active
                          ? "border-foreground ring-2 ring-foreground/10"
                          : "border-border hover:border-foreground/40",
                      )}
                    >
                      {plan.recommended ? (
                        <span className="absolute -top-2 left-3 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">
                          <Crown className="size-3" />
                          {t("Рекомендуем")}
                        </span>
                      ) : null}
                      <div className="flex items-center justify-between">
                        <span className="grid size-9 place-items-center rounded-lg bg-muted">
                          <Icon className="size-4" />
                        </span>
                        <span
                          className={cn(
                            "grid size-5 place-items-center rounded-full ring-2",
                            active
                              ? "bg-foreground text-background ring-foreground"
                              : "ring-border",
                          )}
                        >
                          {active ? <Check className="size-3" /> : null}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-semibold">{t(plan.name)}</p>
                        <p className="text-xs text-muted-foreground">
                          {t(plan.description)}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-semibold">
                          ${plan.pricePerDay}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          / {t("день")}
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs">
                        {plan.bullets.map((b) => (
                          <li
                            key={b.label}
                            className={cn(
                              "flex items-center gap-1.5",
                              !b.included &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            <CircleCheck
                              className={cn(
                                "size-3.5",
                                b.included
                                  ? "text-emerald-500"
                                  : "text-muted-foreground/40",
                              )}
                            />
                            {t(b.label)}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-muted-foreground">
                        {t("Франшиза")}: <strong>${plan.deductible}</strong>
                      </p>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section step={3} title={t("Добавить оборудование и услуги")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {ADDONS.map((a) => (
                  <AddonCard
                    key={a.id}
                    addon={a}
                    selected={addons.has(a.id)}
                    onToggle={() => toggleAddon(a.id)}
                  />
                ))}
              </div>
            </Section>

            <Section step={4} title={t("Способ оплаты")}>
              <Tabs
                value={paymentMethod}
                onValueChange={(v) =>
                  setPaymentMethod(v as typeof paymentMethod)
                }
              >
                <TabsList className="flex w-full bg-muted p-1">
                  <TabsTrigger value="card" className="gap-1.5">
                    <CreditCard className="size-3.5" />
                    <span className="hidden sm:inline">{t("Карта")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="bank" className="gap-1.5">
                    <Building2 className="size-3.5" />
                    <span className="hidden sm:inline">{t("Банк")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="cash" className="gap-1.5">
                    <Banknote className="size-3.5" />
                    <span className="hidden sm:inline">{t("Наличные")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="usdt" className="gap-1.5">
                    <Bitcoin className="size-3.5" />
                    USDT
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-4">
                  <CardForm />
                </TabsContent>
                <TabsContent value="bank" className="mt-4">
                  <BankForm total={total} />
                </TabsContent>
                <TabsContent value="cash" className="mt-4">
                  <CashNotice />
                </TabsContent>
                <TabsContent value="usdt" className="mt-4">
                  <UsdtPayment amountUsd={total} />
                </TabsContent>
              </Tabs>
            </Section>

            <Section step={5} title={t("Чек-лист и подпись")}>
              <PretripChecklist />
            </Section>
          </div>

          <TripSummary
            car={car}
            range={range}
            days={days}
            subtotal={subtotal}
            discount={discount}
            protection={{ name: t(protection.name), cost: protectionCost }}
            addonsList={Array.from(addons)
              .map((id) => ADDONS.find((a) => a.id === id))
              .filter((x): x is Addon => Boolean(x))}
            addonsCost={addonsCost}
            pickupFee={pickupOption.fee}
            pickupLabel={t(pickupOption.label)}
            serviceFee={serviceFee}
            total={total}
            onReserve={reserve}
            reserved={reserved}
            escrowStep={escrowStep}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs({ car }: { car: Car }) {
  const t = useTranslations();
  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground">
      <Link href="/cars" className="hover:text-foreground">
        {t("Машины")}
      </Link>
      <ChevronRight className="size-3" />
      <Link href={`/cars/${car.slug}`} className="hover:text-foreground">
        {car.make} {car.model}
      </Link>
      <ChevronRight className="size-3" />
      <span className="text-foreground">{t("Оформление")}</span>
    </nav>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
          {step}
        </span>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FormField({
  label,
  icon,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
        <span className="text-muted-foreground">{icon}</span>
        <Input
          placeholder={placeholder}
          className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
        />
      </span>
    </label>
  );
}

function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.71 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.71A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function AddonCard({
  addon,
  selected,
  onToggle,
}: {
  addon: Addon;
  selected: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations();
  const Icon = addon.icon;
  const priceLabel =
    addon.pricing.kind === "perDay"
      ? `+$${addon.pricing.price}/${t("день")}`
      : `+$${addon.pricing.price}`;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-background p-4 text-left transition-colors",
        selected
          ? "border-foreground ring-2 ring-foreground/10"
          : "border-border hover:border-foreground/40",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg",
          selected
            ? "bg-foreground text-background"
            : "bg-muted text-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{t(addon.name)}</p>
          <span className="text-xs font-medium text-muted-foreground">
            {priceLabel}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
          {t(addon.description)}
        </p>
      </div>
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full ring-2",
          selected
            ? "bg-foreground text-background ring-foreground"
            : "ring-border",
        )}
      >
        {selected ? <Check className="size-3" /> : null}
      </span>
    </button>
  );
}

function CardForm() {
  const t = useTranslations();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FormField
        label={t("Номер карты")}
        icon={<CreditCard className="size-3.5" />}
        placeholder="4242 4242 4242 4242"
      />
      <FormField
        label={t("Имя владельца")}
        icon={<User className="size-3.5" />}
        placeholder="John Doe"
      />
      <FormField
        label={t("Срок действия")}
        icon={<CalendarDays className="size-3.5" />}
        placeholder="MM / YY"
      />
      <FormField
        label={t("CVC")}
        icon={<Lock className="size-3.5" />}
        placeholder="123"
      />
      <Alert className="sm:col-span-2">
        <Lock className="size-4" />
        <AlertTitle>{t("Списание через эскроу")}</AlertTitle>
        <AlertDescription>
          {t(
            "Visa / Mastercard / Mir. Сумма авторизуется сейчас и удерживается до конца поездки. При отмене за 48+ часов до старта списание не происходит.",
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

function BankForm({ total }: { total: number }) {
  const t = useTranslations();
  const paymentReference = useId()
    .replace(/:/g, "")
    .slice(-4)
    .padStart(4, "0")
    .toUpperCase();

  return (
    <div className="space-y-3">
      <Alert>
        <Building2 className="size-4" />
        <AlertTitle>{t("Банковский перевод (KGS)")}</AlertTitle>
        <AlertDescription>
          {t(
            "Реквизиты для оплаты придут на email. После поступления средства конвертируются в USDT и блокируются в эскроу.",
          )}
        </AlertDescription>
      </Alert>
      <ul className="space-y-1.5 rounded-xl border border-border bg-background p-4 text-sm">
        <li className="flex justify-between">
          <span className="text-muted-foreground">{t("Банк")}</span>
          <span className="font-medium">Optima Bank, Bishkek</span>
        </li>
        <li className="flex justify-between">
          <span className="text-muted-foreground">{t("Счёт")}</span>
          <span className="font-mono">1234-5678-9012-3456</span>
        </li>
        <li className="flex justify-between">
          <span className="text-muted-foreground">SWIFT</span>
          <span className="font-mono">ENEJKG22</span>
        </li>
        <li className="flex justify-between">
          <span className="text-muted-foreground">{t("Назначение")}</span>
          <span className="font-mono">KP-2026-{paymentReference}</span>
        </li>
        <li className="flex justify-between border-t border-dashed border-border pt-2">
          <span className="text-muted-foreground">{t("Сумма")}</span>
          <span className="font-semibold">
            ${total.toFixed(2)} (≈ {(total * 87).toFixed(0)} KGS)
          </span>
        </li>
      </ul>
    </div>
  );
}

function CashNotice() {
  const t = useTranslations();
  return (
    <Alert>
      <Banknote className="size-4" />
      <AlertTitle>{t("Оплата наличными при получении")}</AlertTitle>
      <AlertDescription>
        {t(
          "Платите хосту в USD или KGS. Залог нельзя оплатить наличными — он замораживается в эскроу через карту или USDT до получения авто.",
        )}
      </AlertDescription>
    </Alert>
  );
}

interface SummaryProps {
  car: Car;
  range: DateRange | undefined;
  days: number;
  subtotal: number;
  discount: number;
  protection: { name: string; cost: number };
  addonsList: Addon[];
  addonsCost: number;
  pickupFee: number;
  pickupLabel: string;
  serviceFee: number;
  total: number;
  onReserve: () => void;
  reserved: boolean;
  escrowStep: EscrowStep;
  paymentMethod: "card" | "bank" | "cash" | "usdt";
}

function TripSummary(p: SummaryProps) {
  const t = useTranslations();
  return (
    <aside className="lg:sticky lg:top-20 lg:h-fit">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={p.car.photos[0]}
              alt={`${p.car.make} ${p.car.model}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {p.car.make} {p.car.model}
            </p>
            <p className="text-xs text-muted-foreground">
              {p.car.year} · {p.car.city}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs">
              <Star className="size-3 fill-foreground text-foreground" />
              <span className="font-semibold">{p.car.rating.toFixed(2)}</span>
              <span className="text-muted-foreground">
                · {p.car.trips} {t("поездок")}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl bg-muted/50 p-3 text-xs">
          <p className="flex justify-between">
            <span className="text-muted-foreground">{t("Даты поездки")}</span>
            <span className="font-medium">
              {p.range?.from && p.range?.to
                ? `${format(p.range.from, "MMM d")} → ${format(p.range.to, "MMM d")}`
                : t("Выбрать даты")}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">{t("Получение")}</span>
            <span className="font-medium">{p.pickupLabel}</span>
          </p>
        </div>

        <ul className="space-y-1.5 text-sm">
          <Row
            label={`$${p.car.pricePerDay} × ${p.days} ${p.days === 1 ? t("день") : t("дн.")}`}
            value={p.days > 0 ? `$${p.subtotal.toFixed(0)}` : "—"}
          />
          {p.discount > 0 ? (
            <Row
              tone="emerald"
              label={t("Скидка за неделю")}
              value={`−$${p.discount.toFixed(0)}`}
            />
          ) : null}
          {p.protection.cost > 0 ? (
            <Row
              label={t("Защита: {plan}", { plan: p.protection.name })}
              value={`$${p.protection.cost.toFixed(0)}`}
            />
          ) : null}
          {p.pickupFee > 0 ? (
            <Row label={t("Доставка")} value={`$${p.pickupFee}`} />
          ) : null}
          {p.addonsList.length ? (
            <li className="space-y-1 pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("Доп. опции")}
              </p>
              {p.addonsList.map((a) => (
                <Row
                  key={a.id}
                  label={t(a.name)}
                  value={
                    a.pricing.kind === "perDay"
                      ? `$${(a.pricing.price * p.days).toFixed(0)}`
                      : `$${a.pricing.price}`
                  }
                />
              ))}
            </li>
          ) : null}
          {p.days > 0 ? (
            <Row
              label={t("Сервисный сбор")}
              value={`$${p.serviceFee.toFixed(0)}`}
            />
          ) : null}
        </ul>

        <div className="flex items-center justify-between border-t border-dashed border-border pt-3 text-base font-semibold">
          <span>{t("Итого")}</span>
          <span>${p.total.toFixed(0)}</span>
        </div>
        <p className="-mt-2 text-xs text-muted-foreground">
          {t("+ ${deposit} возвратный залог (заморожен в эскроу)", {
            deposit: p.car.deposit,
          })}
        </p>

        <div className="rounded-xl bg-muted/40 p-3">
          <EscrowProgress current={p.escrowStep} />
        </div>

        {p.reserved ? (
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60">
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4" />
              <p className="text-sm font-semibold">
                {t("Бронь зафиксирована в эскроу")}
              </p>
            </div>
            <p className="mt-1 text-xs">
              {t("Машина забронирована. Деньги хосту переведутся {when}.", {
                when: p.range?.to
                  ? format(p.range.to, "MMM d")
                  : t("после поездки"),
              })}
            </p>
          </div>
        ) : (
          <Button
            size="lg"
            disabled={p.days === 0}
            onClick={p.onReserve}
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-40"
          >
            <Lock className="size-4" />
            {t("Забронировать и заморозить в эскроу")}
          </Button>
        )}

        <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="size-3" />
          {t("Списание произойдёт только после подтверждения хостом.")}
        </p>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "emerald";
}) {
  return (
    <li
      className={cn(
        "flex items-center justify-between text-sm",
        tone === "emerald" && "text-emerald-700 dark:text-emerald-400",
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}

function ReservationConfirmed({
  car,
  step,
  setStep,
}: {
  car: Car;
  step: EscrowStep;
  setStep: (s: EscrowStep) => void;
}) {
  const t = useTranslations();
  const allSteps: EscrowStep[] = [
    "reserved",
    "funded",
    "active",
    "returned",
    "released",
  ];
  const idx = allSteps.indexOf(step);

  function next() {
    if (idx < allSteps.length - 1) setStep(allSteps[idx + 1]);
  }

  return (
    <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 ring-1 ring-emerald-200/40 dark:border-emerald-900/60 dark:bg-emerald-950/30">
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-emerald-500 text-background">
          <CircleCheck className="size-5" />
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("Бронь подтверждена")}
          </h1>
          <p className="mt-1 text-sm text-emerald-900/80 dark:text-emerald-200/80">
            {t(
              "Деньги в эскроу. У хоста есть 12 часов на подтверждение. Управляйте бронью из личного кабинета.",
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/cars/${car.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {t("Посмотреть машину")}
            </Link>
            <Button
              size="sm"
              onClick={next}
              disabled={idx === allSteps.length - 1}
            >
              {t("Продвинуть эскроу (демо)")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
