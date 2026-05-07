"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/i18n/client";
import { useAuthStore } from "@/features/auth/model/auth-store";
import {
  useRequestEmailOtpMutation,
  useVerifyEmailOtpMutation,
} from "@/features/auth/hooks/use-auth";
import { AlertCircle, CheckCircle2, Mail, MessageSquareText, Phone } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email(),
});

const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
});

type AuthScreenProps = {
  variant: "login" | "signup";
};

export function AuthScreen({ variant }: AuthScreenProps) {
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
  const intro =
    variant === "signup"
      ? t(
          "Создайте аккаунт без пароля. Email-код работает уже сейчас, Google подключится сразу после конфигурации на бэке, телефон заложен следующим шагом.",
        )
      : t(
          "Войдите без пароля. Мы поддерживаем email-код, Google и телефонный вход, но прямо сейчас production-бэк уже готов для email OTP.",
        );

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
        "Google вход сейчас недоступен на backend-конфиге. Email OTP уже работает и готов для пользователей.",
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

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-7 shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {variant === "signup"
              ? t("Создать аккаунт CarPal")
              : t("Войти в CarPal")}
          </h1>
          <p className="text-sm text-muted-foreground">{intro}</p>
        </div>

        {authError ? (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{authError}</p>
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          <Button asChild variant="outline" size="lg" className="w-full justify-start">
            <Link href="/api/auth/google">
              <GoogleIcon />
              Google
            </Link>
          </Button>

          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("Телефон")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "UI уже готов под phone OTP, но на backend сейчас ещё нет SMS-провайдера и phone auth endpoints.",
                    )}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("Скоро")}
              </span>
            </div>
          </div>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <Separator className="flex-1" />
          {t("или")}
          <Separator className="flex-1" />
        </div>

        {!pendingEmail ? (
          <form
            onSubmit={emailForm.handleSubmit(handleEmailRequest)}
            className="space-y-3"
          >
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("Email")}
              </span>
              <span className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <Mail className="size-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
                  {...emailForm.register("email")}
                />
              </span>
            </label>
            {emailForm.formState.errors.email ? (
              <p className="text-sm text-destructive">
                {t("Введите корректный email.")}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              disabled={requestMutation.isPending}
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <MessageSquareText className="size-4" />
              {requestMutation.isPending
                ? t("Отправляем код...")
                : t("Получить код")}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={codeForm.handleSubmit(handleCodeVerify)}
            className="space-y-3"
          >
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-brand" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {t("Код отправлен на")}{" "}
                    <span className="font-semibold text-foreground">
                      {pendingEmail}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {secondsLeft > 0
                      ? t("Код действует ещё {seconds} сек.", {
                          seconds: secondsLeft,
                        })
                      : t("Можно запросить новый код.")}
                  </p>
                </div>
              </div>
            </div>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("Код подтверждения")}
              </span>
              <Input
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                autoComplete="one-time-code"
                className={cn(
                  "mt-1 h-11 rounded-lg text-base tracking-[0.35em]",
                  "placeholder:tracking-normal",
                )}
                {...codeForm.register("code")}
              />
            </label>
            {codeForm.formState.errors.code ? (
              <p className="text-sm text-destructive">
                {t("Введите 6-значный код из письма.")}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              disabled={verifyMutation.isPending}
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {verifyMutation.isPending
                ? t("Подтверждаем...")
                : variant === "signup"
                  ? t("Создать аккаунт")
                  : t("Войти")}
            </Button>

            <div className="flex items-center justify-between gap-2 text-sm">
              <button
                type="button"
                onClick={resetEmailStep}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("Изменить email")}
              </button>
              <button
                type="button"
                onClick={emailForm.handleSubmit(handleEmailRequest)}
                disabled={requestMutation.isPending}
                className="font-medium text-foreground transition-opacity disabled:opacity-50"
              >
                {t("Отправить код снова")}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {variant === "signup" ? t("Уже есть вход?") : t("Новый пользователь?")}{" "}
          <Link
            href={variant === "signup" ? "/login" : "/signup"}
            className="font-semibold text-foreground hover:underline"
          >
            {variant === "signup" ? t("Открыть вход") : t("Создать аккаунт")}
          </Link>
        </p>
      </div>
    </div>
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
