import Link from "next/link";
import { Mail, Lock, User, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const metadata = { title: "Регистрация" };

export default async function SignupPage() {
  const t = await getTranslations();
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-7 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("Создать аккаунт CarPal")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "Регистрация бесплатная. Проверьте права один раз — арендуйте сколько угодно.",
          )}
        </p>

        <form className="mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field
              icon={<User className="size-4" />}
              label={t("Имя")}
              placeholder="John"
            />
            <Field
              icon={<User className="size-4" />}
              label={t("Фамилия")}
              placeholder="Doe"
            />
          </div>
          <Field
            icon={<Mail className="size-4" />}
            label={t("Email")}
            placeholder="you@example.com"
            type="email"
          />
          <Field
            icon={<Phone className="size-4" />}
            label={t("Телефон")}
            placeholder="+1 555 123 4567"
          />
          <Field
            icon={<Lock className="size-4" />}
            label={t("Пароль")}
            placeholder={t("Минимум 8 символов")}
            type="password"
          />

          <label className="flex items-start gap-2 pt-2 text-xs text-muted-foreground">
            <Checkbox className="mt-0.5" />
            <span>
              {t("Принимаю")}{" "}
              <Link
                href="#"
                className="font-semibold text-foreground hover:underline"
              >
                {t("Условия использования")}
              </Link>{" "}
              {t("и")}{" "}
              <Link
                href="#"
                className="font-semibold text-foreground hover:underline"
              >
                {t("Политику конфиденциальности")}
              </Link>
              .
            </span>
          </label>

          <Button
            size="lg"
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {t("Создать аккаунт")}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {t("Уже есть аккаунт?")}{" "}
          <Link
            href="/login"
            className="font-semibold text-foreground hover:underline"
          >
            {t("Войти")}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  placeholder,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <span className="text-muted-foreground">{icon}</span>
        <Input
          type={type}
          placeholder={placeholder}
          className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
        />
      </span>
    </label>
  );
}
