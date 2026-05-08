"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/i18n/client";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/features/auth/model/auth-store";
import {
  useRequestEmailOtpMutation,
  useVerifyEmailOtpMutation,
} from "@/features/auth/hooks/use-auth";

const emailSchema = z.object({
  email: z.string().email(),
});

const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
});

export function AuthScreen() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((store) => store.user);
  const isInitialized = useAuthStore((store) => store.isInitialized);
  const requestMutation = useRequestEmailOtpMutation();
  const verifyMutation = useVerifyEmailOtpMutation();
  const [pendingEmail, setPendingEmail] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const codeForm = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });
  const googleError = searchParams.get("error");

  useEffect(() => {
    if (isInitialized && user) {
      router.replace("/");
    }
  }, [isInitialized, router, user]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [secondsLeft]);

  const authError = useMemo(() => {
    if (verifyMutation.error instanceof Error) {
      return verifyMutation.error.message;
    }

    if (requestMutation.error instanceof Error) {
      return requestMutation.error.message;
    }

    if (googleError === "google_unavailable") {
      return t(
        "Google вход сейчас недоступен. Попробуйте email-код.",
      );
    }

    if (googleError === "google_misconfigured") {
      return t("Google вход временно не настроен.");
    }

    return null;
  }, [googleError, requestMutation.error, t, verifyMutation.error]);

  async function handleEmailRequest(values: z.infer<typeof emailSchema>) {
    const response = await requestMutation.mutateAsync(values);

    setPendingEmail(values.email);
    setSecondsLeft(response.expiresIn);
    codeForm.reset({
      code: "",
    });
  }

  async function handleCodeVerify(values: z.infer<typeof codeSchema>) {
    await verifyMutation.mutateAsync({
      code: values.code,
      email: pendingEmail,
    });
    router.replace("/");
  }

  function resetEmailStep() {
    setPendingEmail("");
    setSecondsLeft(0);
    codeForm.reset({
      code: "",
    });
  }

  async function handlePasteCode() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, "").slice(0, 6);

      if (digits) {
        codeForm.setValue("code", digits, { shouldValidate: true });
      }
    } catch {
      // Clipboard permission denied — ignore.
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url('https://www.baibol.kg/img/attraction_gallery/152413549593403.jpg')] bg-cover bg-center bg-no-repeat sm:items-center sm:justify-center sm:px-4 sm:py-12">
      <div className="flex w-full max-w-md flex-1 flex-col bg-brand sm:flex-none sm:overflow-hidden sm:rounded-3xl">
        <div className="space-y-2 px-7 pb-14 pt-10 text-brand-foreground">
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-3xl">
            {t("Добро пожаловать в CarPal")}
          </h1>
          <p className="text-sm text-brand-foreground/85">
            {t(
              "Войдите без пароля и продолжайте бронировать, где остановились.",
            )}
          </p>
        </div>

        <div className="flex-1 rounded-t-3xl bg-background px-6 pb-10 pt-7 text-foreground sm:rounded-t-3xl">
          {!pendingEmail ? (
            <form
              onSubmit={emailForm.handleSubmit(handleEmailRequest)}
              className="space-y-5"
              noValidate
            >
              <h2 className="text-center text-lg font-semibold">
                {t("Войти")}
              </h2>

              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("Email")}
                </span>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  className="mt-1.5 h-11 rounded-xl"
                  {...emailForm.register("email")}
                />
                {emailForm.formState.errors.email ? (
                  <span className="mt-1 block text-xs text-destructive">
                    {t("Введите корректный email.")}
                  </span>
                ) : null}
              </label>

              <Button
                type="submit"
                size="lg"
                disabled={requestMutation.isPending}
                className="h-12 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
              >
                {requestMutation.isPending
                  ? t("Отправляем...")
                  : t("Продолжить")}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={codeForm.handleSubmit(handleCodeVerify)}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-1 text-center">
                <h2 className="text-lg font-semibold">
                  {t("Проверьте почту")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("Мы отправили код на")}{" "}
                  <span className="font-medium text-foreground">
                    {pendingEmail}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  inputMode="numeric"
                  placeholder="123 456"
                  maxLength={6}
                  autoComplete="one-time-code"
                  className={cn(
                    "h-12 flex-1 rounded-xl text-base tracking-[0.35em]",
                    "placeholder:tracking-normal",
                  )}
                  {...codeForm.register("code")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasteCode}
                  className="h-12 rounded-xl px-4 text-sm font-medium"
                >
                  {t("Вставить")}
                </Button>
              </div>
              {codeForm.formState.errors.code ? (
                <p className="text-xs text-destructive">
                  {t("Введите 6-значный код из письма.")}
                </p>
              ) : null}

              <p className="text-center text-xs text-muted-foreground">
                {t("Не получили код?")}{" "}
                <button
                  type="button"
                  onClick={emailForm.handleSubmit(handleEmailRequest)}
                  disabled={requestMutation.isPending || secondsLeft > 0}
                  className="font-medium text-brand transition-opacity disabled:opacity-60"
                >
                  {secondsLeft > 0
                    ? t("Отправить ещё через {seconds} сек", {
                        seconds: secondsLeft,
                      })
                    : t("Отправить заново")}
                </button>
              </p>

              <Button
                type="submit"
                size="lg"
                disabled={verifyMutation.isPending}
                className="h-12 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
              >
                {verifyMutation.isPending
                  ? t("Подтверждаем...")
                  : t("Подтвердить")}
              </Button>

              <button
                type="button"
                onClick={resetEmailStep}
                className="block w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("Изменить email")}
              </button>
            </form>
          )}

          {authError ? (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{authError}</p>
            </div>
          ) : null}

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {t("или войдите через")}
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl border-border bg-background text-sm font-medium"
            >
              <NextLink href="/api/auth/google">
                <GoogleIcon />
                Google
              </NextLink>
            </Button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-medium text-muted-foreground opacity-70"
            >
              <Phone className="size-4" />
              <span>{t("Телефон")}</span>
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("Скоро")}
              </span>
            </button>
          </div>

          <p className="mt-7 text-center text-xs text-muted-foreground">
            {t("Аккаунта нет? Создадим автоматически после ввода кода.")}
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        d="M21.6 12.227c0-.696-.062-1.367-.179-2.011H12v3.806h5.385c-.232 1.252-.937 2.312-1.997 3.022v2.512h3.234c1.892-1.742 2.978-4.31 2.978-7.329z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.622-2.422l-3.234-2.512c-.895.6-2.04.954-3.388.954-2.605 0-4.81-1.76-5.598-4.123H3.062v2.59A9.997 9.997 0 0 0 12 22z"
        fill="#34A853"
      />
      <path
        d="M6.402 13.897A5.99 5.99 0 0 1 6.087 12c0-.66.114-1.297.315-1.897v-2.59H3.062A9.997 9.997 0 0 0 2 12c0 1.612.388 3.135 1.062 4.487l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.98c1.47 0 2.788.505 3.825 1.495l2.868-2.868C16.957 2.992 14.692 2 12 2 8.103 2 4.736 4.236 3.062 7.513l3.34 2.59C7.19 7.74 9.395 5.98 12 5.98z"
        fill="#EA4335"
      />
    </svg>
  );
}
