import Link from "next/link";
import { Mail, Lock, Apple } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Войти" };

export default async function LoginPage() {
  const t = await getTranslations();
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-7 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("С возвращением")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Войдите, чтобы управлять поездками, сообщениями и избранным.")}
        </p>

        <form className="mt-6 space-y-3">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("Email")}
            </span>
            <span className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <Mail className="size-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("Пароль")}
            </span>
            <span className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <Lock className="size-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                className="h-auto border-none p-0 shadow-none focus-visible:ring-0"
              />
            </span>
          </label>

          <Button
            size="lg"
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {t("Войти")}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <Separator className="flex-1" />
          {t("или продолжить через")}
          <Separator className="flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="lg">
            <GoogleIcon /> Google
          </Button>
          <Button variant="outline" size="lg">
            <Apple className="size-4" /> Apple
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("Впервые здесь?")}{" "}
          <Link
            href="/signup"
            className="font-semibold text-foreground hover:underline"
          >
            {t("Создать аккаунт")}
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
