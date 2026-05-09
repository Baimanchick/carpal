"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  AlertCircle,
  Building2,
  Car,
  Handshake,
  Send,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/shared/api/axios";
import { cn } from "@/lib/utils";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  SUPPORT_TELEGRAM_HANDLE,
  SUPPORT_TELEGRAM_URL,
} from "@/lib/contacts";
import { useTranslations } from "@/i18n/client";
import { useCreateLeadMutation } from "@/features/leads/hooks/use-leads";
import { readUtmFromSearch, type UtmFields } from "@/features/leads/model/utm";
import type {
  FleetSize,
  HostCarsCount,
  LeadInput,
  LeadKind,
  PartnerKind,
} from "@/features/leads/model/leads.types";
import { LeadSuccess } from "./lead-success";

const PHONE_REGEX = /^\+\d{10,15}$/;

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

const touristSchema = z
  .object({
    contactMode: z.enum(["email", "phone"]),
    email: z.string().optional(),
    phoneE164: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contactMode === "email") {
      const result = z.string().email().safeParse(data.email);

      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Введите корректный email",
        });
      }

      return;
    }

    if (!data.phoneE164 || !PHONE_REGEX.test(normalizePhone(data.phoneE164))) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneE164"],
        message: "Введите телефон в формате +996...",
      });
    }
  });

const phoneField = z
  .string()
  .refine(
    (value) => PHONE_REGEX.test(normalizePhone(value)),
    "Введите телефон в формате +996...",
  );

const hostSchema = z.object({
  name: z.string().min(2, "Укажите имя"),
  phoneE164: phoneField,
  city: z.string().min(2, "Укажите город"),
  carsCount: z.enum(["1", "2", "3+"]),
});

const fleetSchema = z.object({
  name: z.string().min(2, "Укажите имя"),
  phoneE164: phoneField,
  company: z.string().min(2, "Укажите название компании"),
  fleetSize: z.enum(["5-10", "10-25", "25+"]),
});

const partnerSchema = z.object({
  name: z.string().min(2, "Укажите имя"),
  phoneE164: phoneField,
  company: z.string().min(2, "Укажите компанию"),
  partnerKind: z.enum([
    "insurance",
    "tour",
    "hotel",
    "marketplace",
    "transfer",
    "other",
  ]),
});

type TouristValues = z.infer<typeof touristSchema>;
type HostValues = z.infer<typeof hostSchema>;
type FleetValues = z.infer<typeof fleetSchema>;
type PartnerValues = z.infer<typeof partnerSchema>;

type LeadKindMeta = {
  hint: string;
  icon: typeof User;
  kind: LeadKind;
  label: string;
  offer: string;
};

const LEAD_KINDS: ReadonlyArray<LeadKindMeta> = [
  {
    kind: "tourist",
    label: "Туристы",
    icon: User,
    offer: "Получите первые сутки аренды бесплатно. Первые 100 участников.",
    hint: "Один клик до запуска. Расскажем заранее и дадим промокод.",
  },
  {
    kind: "host",
    label: "Хосты",
    icon: Car,
    offer: "0% комиссии первые 2 месяца. $300–800 в месяц с одной машины.",
    hint: "Если у вас 1–2 машины и вы готовы сдавать их в аренду.",
  },
  {
    kind: "fleet",
    label: "Автопарки",
    icon: Building2,
    offer: "Бесплатная интеграция и пилотная программа.",
    hint: "От 5 машин: API, отчёты и приоритетная поддержка.",
  },
  {
    kind: "partner",
    label: "Партнёры",
    icon: Handshake,
    offer: "Первые партнёры получают приоритетное размещение.",
    hint: "Страховые, туроператоры, отели, маркетплейсы, трансферы.",
  },
];

const HOST_CARS_OPTIONS: ReadonlyArray<{
  label: string;
  value: HostCarsCount;
}> = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3+", label: "3+" },
];

const FLEET_SIZE_OPTIONS: ReadonlyArray<{
  label: string;
  value: FleetSize;
}> = [
  { value: "5-10", label: "5–10" },
  { value: "10-25", label: "10–25" },
  { value: "25+", label: "25+" },
];

const PARTNER_KIND_OPTIONS: ReadonlyArray<{
  label: string;
  value: PartnerKind;
}> = [
  { value: "insurance", label: "Страховая компания" },
  { value: "tour", label: "Туроператор / турагентство" },
  { value: "hotel", label: "Отель / гостевой дом" },
  { value: "marketplace", label: "Маркетплейс" },
  { value: "transfer", label: "Трансфер / такси" },
  { value: "other", label: "Другое" },
];

type SubmittedLead = {
  kind: LeadKind;
  publicCode: string;
};

export function LeadForms() {
  const t = useTranslations();
  const [activeKind, setActiveKind] = useState<LeadKind>("tourist");
  const [utm] = useState<UtmFields>(() =>
    typeof window === "undefined"
      ? {}
      : readUtmFromSearch(window.location.search),
  );
  const [submitted, setSubmitted] = useState<SubmittedLead | null>(null);
  const activeMeta =
    LEAD_KINDS.find((meta) => meta.kind === activeKind) ?? LEAD_KINDS[0];

  function handleSwitchKind(next: LeadKind) {
    if (next === activeKind) {
      return;
    }

    setActiveKind(next);
    setSubmitted(null);
  }

  function handleSuccess(publicCode: string) {
    setSubmitted({ kind: activeKind, publicCode });
  }

  return (
    <section
      id="early-access"
      className="relative isolate overflow-hidden bg-muted/40 py-20 sm:py-24 lg:py-28"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-32 -z-10 hidden h-[460px] w-[460px] rounded-full bg-gradient-to-br from-brand to-brand/70 opacity-90 sm:block"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="relative">
            <div className="mb-8 max-w-md">
              <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {t("Поговорим")}
              </h2>
              <p className="mt-2 text-sm text-foreground/70 sm:text-base">
                {t("С кем мы связываемся?")}
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-background p-5 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.25)] sm:p-8">
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {LEAD_KINDS.map((meta) => {
                  const isActive = meta.kind === activeKind;
                  const Icon = meta.icon;

                  return (
                    <button
                      key={meta.kind}
                      type="button"
                      onClick={() => handleSwitchKind(meta.kind)}
                      aria-pressed={isActive}
                      className={cn(
                        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand text-brand-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      <span>{t(meta.label)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-border/60 pt-6">
                <p className="text-sm font-medium text-foreground">
                  {t(activeMeta.offer)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {t(activeMeta.hint)}
                </p>
              </div>

              <div className="mt-6">
                {submitted ? (
                  <LeadSuccess
                    leadKind={submitted.kind}
                    publicCode={submitted.publicCode}
                    onReset={() => setSubmitted(null)}
                  />
                ) : (
                  <ActiveLeadForm
                    kind={activeKind}
                    utm={utm}
                    onSuccess={handleSuccess}
                  />
                )}
              </div>
            </div>
          </div>

          <ContactRail />
        </div>
      </div>
    </section>
  );
}

function ContactRail() {
  const t = useTranslations();

  return (
    <aside className="hidden flex-col gap-7 pt-2 lg:flex">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("Телефон")}
        </p>
        <a
          href={`tel:${SUPPORT_PHONE_TEL}`}
          className="mt-1 block text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          {SUPPORT_PHONE}
        </a>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("Telegram")}
        </p>
        <a
          href={SUPPORT_TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          {SUPPORT_TELEGRAM_HANDLE}
        </a>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("Email")}
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-1 block text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          {SUPPORT_EMAIL}
        </a>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("Запуск")}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {t("20 мая 2026")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("Открытое бета-тестирование")}
        </p>
      </div>
    </aside>
  );
}

type ActiveLeadFormProps = {
  kind: LeadKind;
  onSuccess: (publicCode: string) => void;
  utm: UtmFields;
};

function ActiveLeadForm({ kind, onSuccess, utm }: ActiveLeadFormProps) {
  if (kind === "tourist") {
    return <TouristForm utm={utm} onSuccess={onSuccess} />;
  }

  if (kind === "host") {
    return <HostForm utm={utm} onSuccess={onSuccess} />;
  }

  if (kind === "fleet") {
    return <FleetForm utm={utm} onSuccess={onSuccess} />;
  }

  return <PartnerForm utm={utm} onSuccess={onSuccess} />;
}

type FormProps = {
  onSuccess: (publicCode: string) => void;
  utm: UtmFields;
};

function TouristForm({ onSuccess, utm }: FormProps) {
  const t = useTranslations();
  const mutation = useCreateLeadMutation();
  const form = useForm<TouristValues>({
    resolver: zodResolver(touristSchema),
    defaultValues: {
      contactMode: "email",
      email: "",
      phoneE164: "",
    },
  });
  const contactMode = useWatch({ control: form.control, name: "contactMode" });
  const errorMessage = useApiErrorMessage(mutation.error);

  async function onSubmit(values: TouristValues) {
    const payload: LeadInput = {
      leadKind: "tourist",
      ...(values.contactMode === "email"
        ? { email: values.email }
        : {
            phoneE164: values.phoneE164
              ? normalizePhone(values.phoneE164)
              : undefined,
          }),
      ...utm,
    };

    const response = await mutation.mutateAsync(payload);
    onSuccess(response.publicCode);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <FieldRow label={t("Контакт")} required>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <div
            role="radiogroup"
            aria-label={t("Тип контакта")}
            className="inline-flex h-11 shrink-0 rounded-md border border-border bg-muted/30 p-1 text-sm font-medium"
          >
            <button
              type="button"
              role="radio"
              aria-checked={contactMode === "email"}
              onClick={() => form.setValue("contactMode", "email")}
              className={cn(
                "inline-flex items-center justify-center rounded-[5px] px-3 transition-colors",
                contactMode === "email"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("Email")}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={contactMode === "phone"}
              onClick={() => form.setValue("contactMode", "phone")}
              className={cn(
                "inline-flex items-center justify-center rounded-[5px] px-3 transition-colors",
                contactMode === "phone"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("Телефон")}
            </button>
          </div>
          {contactMode === "email" ? (
            <FlatInput
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              className="min-w-0 flex-1"
              {...form.register("email")}
            />
          ) : (
            <FlatInput
              type="tel"
              placeholder="+996 555 12 34 56"
              autoComplete="tel"
              inputMode="tel"
              className="min-w-0 flex-1"
              {...form.register("phoneE164")}
            />
          )}
        </div>
        <FieldError
          message={
            contactMode === "email"
              ? form.formState.errors.email?.message
              : form.formState.errors.phoneE164?.message
          }
        />
      </FieldRow>

      <SubmitArea
        label={t("Получить бесплатные сутки")}
        loadingLabel={t("Отправляем")}
        mutationPending={mutation.isPending}
        errorMessage={errorMessage}
      />
    </form>
  );
}

function HostForm({ onSuccess, utm }: FormProps) {
  const t = useTranslations();
  const mutation = useCreateLeadMutation();
  const form = useForm<HostValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: "",
      phoneE164: "",
      city: "",
      carsCount: "1",
    },
  });
  const carsCount = useWatch({ control: form.control, name: "carsCount" });
  const errorMessage = useApiErrorMessage(mutation.error);

  async function onSubmit(values: HostValues) {
    const response = await mutation.mutateAsync({
      leadKind: "host",
      name: values.name,
      phoneE164: normalizePhone(values.phoneE164),
      city: values.city,
      carsCount: values.carsCount,
      ...utm,
    });

    onSuccess(response.publicCode);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <FieldRow label={t("Имя")} required>
        <FlatInput
          placeholder={t("Ваше имя")}
          autoComplete="name"
          {...form.register("name")}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </FieldRow>

      <FieldRow label={t("Телефон")} required>
        <FlatInput
          type="tel"
          placeholder="+996 555 12 34 56"
          autoComplete="tel"
          inputMode="tel"
          {...form.register("phoneE164")}
        />
        <FieldError message={form.formState.errors.phoneE164?.message} />
      </FieldRow>

      <FieldRow label={t("Город")} required>
        <FlatInput
          placeholder={t("Бишкек, Ош, Каракол...")}
          autoComplete="address-level2"
          {...form.register("city")}
        />
        <FieldError message={form.formState.errors.city?.message} />
      </FieldRow>

      <FieldRow label={t("Машин")} required>
        <Chips
          value={carsCount}
          options={HOST_CARS_OPTIONS}
          onSelect={(value) =>
            form.setValue("carsCount", value, { shouldValidate: true })
          }
        />
      </FieldRow>

      <SubmitArea
        label={t("Стать хостом")}
        loadingLabel={t("Отправляем")}
        mutationPending={mutation.isPending}
        errorMessage={errorMessage}
      />
    </form>
  );
}

function FleetForm({ onSuccess, utm }: FormProps) {
  const t = useTranslations();
  const mutation = useCreateLeadMutation();
  const form = useForm<FleetValues>({
    resolver: zodResolver(fleetSchema),
    defaultValues: {
      name: "",
      phoneE164: "",
      company: "",
      fleetSize: "5-10",
    },
  });
  const fleetSize = useWatch({ control: form.control, name: "fleetSize" });
  const errorMessage = useApiErrorMessage(mutation.error);

  async function onSubmit(values: FleetValues) {
    const response = await mutation.mutateAsync({
      leadKind: "fleet",
      name: values.name,
      phoneE164: normalizePhone(values.phoneE164),
      company: values.company,
      fleetSize: values.fleetSize,
      ...utm,
    });

    onSuccess(response.publicCode);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <FieldRow label={t("Имя")} required>
        <FlatInput
          placeholder={t("Ваше имя")}
          autoComplete="name"
          {...form.register("name")}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </FieldRow>

      <FieldRow label={t("Телефон")} required>
        <FlatInput
          type="tel"
          placeholder="+996 555 12 34 56"
          autoComplete="tel"
          inputMode="tel"
          {...form.register("phoneE164")}
        />
        <FieldError message={form.formState.errors.phoneE164?.message} />
      </FieldRow>

      <FieldRow label={t("Компания")} required>
        <FlatInput
          placeholder={t("Название автопарка")}
          autoComplete="organization"
          {...form.register("company")}
        />
        <FieldError message={form.formState.errors.company?.message} />
      </FieldRow>

      <FieldRow label={t("Парк")} required>
        <Chips
          value={fleetSize}
          options={FLEET_SIZE_OPTIONS}
          onSelect={(value) =>
            form.setValue("fleetSize", value, { shouldValidate: true })
          }
        />
      </FieldRow>

      <SubmitArea
        label={t("Подключить пилот")}
        loadingLabel={t("Отправляем")}
        mutationPending={mutation.isPending}
        errorMessage={errorMessage}
      />
    </form>
  );
}

function PartnerForm({ onSuccess, utm }: FormProps) {
  const t = useTranslations();
  const mutation = useCreateLeadMutation();
  const form = useForm<PartnerValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      phoneE164: "",
      company: "",
      partnerKind: "tour",
    },
  });
  const partnerKind = useWatch({
    control: form.control,
    name: "partnerKind",
  });
  const errorMessage = useApiErrorMessage(mutation.error);

  async function onSubmit(values: PartnerValues) {
    const response = await mutation.mutateAsync({
      leadKind: "partner",
      name: values.name,
      phoneE164: normalizePhone(values.phoneE164),
      company: values.company,
      partnerKind: values.partnerKind,
      ...utm,
    });

    onSuccess(response.publicCode);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <FieldRow label={t("Имя")} required>
        <FlatInput
          placeholder={t("Ваше имя")}
          autoComplete="name"
          {...form.register("name")}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </FieldRow>

      <FieldRow label={t("Телефон")} required>
        <FlatInput
          type="tel"
          placeholder="+996 555 12 34 56"
          autoComplete="tel"
          inputMode="tel"
          {...form.register("phoneE164")}
        />
        <FieldError message={form.formState.errors.phoneE164?.message} />
      </FieldRow>

      <FieldRow label={t("Компания")} required>
        <FlatInput
          placeholder={t("Название компании")}
          autoComplete="organization"
          {...form.register("company")}
        />
        <FieldError message={form.formState.errors.company?.message} />
      </FieldRow>

      <FieldRow label={t("Формат")} required>
        <Select
          value={partnerKind}
          onValueChange={(value) =>
            form.setValue("partnerKind", value as PartnerKind, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="h-11 w-full rounded-md border-border bg-muted/30 hover:bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PARTNER_KIND_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      <SubmitArea
        label={t("Стать партнёром")}
        loadingLabel={t("Отправляем")}
        mutationPending={mutation.isPending}
        errorMessage={errorMessage}
      />
    </form>
  );
}

type FieldRowProps = {
  children: React.ReactNode;
  label: string;
  required?: boolean;
};

function FieldRow({ children, label, required }: FieldRowProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-[110px_minmax(0,1fr)] sm:items-start sm:gap-4">
      <label className="pt-2.5 text-sm font-medium text-foreground/80">
        {label}
        {required ? <span className="text-brand">*</span> : null}
      </label>
      <div className="min-w-0 space-y-1">{children}</div>
    </div>
  );
}

const FlatInput = ({
  className,
  ...props
}: React.ComponentProps<typeof Input>) => (
  <Input
    {...props}
    className={cn(
      "h-11 rounded-md border-border bg-muted/30 text-sm shadow-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-foreground/30 focus-visible:bg-background focus-visible:ring-0",
      className,
    )}
  />
);

function FieldError({ message }: { message?: string }) {
  const t = useTranslations();

  if (!message) {
    return null;
  }

  return (
    <p className="text-xs italic text-brand">{t(message)}</p>
  );
}

type ChipsProps<T extends string> = {
  onSelect: (value: T) => void;
  options: ReadonlyArray<{ label: string; value: T }>;
  value: T;
};

function Chips<T extends string>({ onSelect, options, value }: ChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2 pt-1.5">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors",
              isActive
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type SubmitAreaProps = {
  errorMessage: string | null;
  label: string;
  loadingLabel: string;
  mutationPending: boolean;
};

function SubmitArea({
  errorMessage,
  label,
  loadingLabel,
  mutationPending,
}: SubmitAreaProps) {
  return (
    <div className="space-y-3 pt-3">
      {errorMessage ? (
        <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <div className="flex sm:justify-end">
        <Button
          type="submit"
          disabled={mutationPending}
          className="h-11 w-full rounded-md bg-brand px-5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-foreground shadow-sm hover:bg-brand/90 disabled:opacity-60 sm:w-auto sm:px-7 sm:tracking-[0.16em]"
        >
          {mutationPending ? loadingLabel : label}
          <Send className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function useApiErrorMessage(error: unknown) {
  const t = useTranslations();

  if (!error) {
    return null;
  }

  if (error instanceof ApiError) {
    if (error.status === 409) {
      return t("Эта заявка уже отправлена. Мы уже на связи.");
    }

    if (error.status >= 500) {
      return t("Сервис временно недоступен. Попробуйте через минуту.");
    }

    return error.message || t("Не удалось отправить заявку. Попробуйте ещё раз.");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return t("Не удалось отправить заявку. Попробуйте ещё раз.");
}
