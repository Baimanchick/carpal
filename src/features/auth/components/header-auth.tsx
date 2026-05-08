"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/features/auth/model/auth-store";

export function HeaderAuthControls() {
  const t = useTranslations();
  const isInitialized = useAuthStore((store) => store.isInitialized);
  const user = useAuthStore((store) => store.user);
  const logoutMutation = useLogoutMutation();

  if (!isInitialized) {
    return (
      <div className="hidden h-8 w-36 rounded-lg bg-muted/70 sm:block" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(buttonVariants({ size: "sm" }), "hidden sm:flex")}
      >
        {t("Войти")}
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="max-w-48 truncate text-sm text-muted-foreground">
        {user.email || t("Аккаунт")}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? t("Выходим...") : t("Выйти")}
      </Button>
    </div>
  );
}

export function HeaderAuthMenuItems() {
  const t = useTranslations();
  const isInitialized = useAuthStore((store) => store.isInitialized);
  const user = useAuthStore((store) => store.user);
  const logoutMutation = useLogoutMutation();

  if (!isInitialized || !user) {
    return (
      <DropdownMenuItem asChild>
        <Link href="/login">{t("Войти")}</Link>
      </DropdownMenuItem>
    );
  }

  return (
    <>
      <DropdownMenuItem disabled>{user.email || t("Аккаунт")}</DropdownMenuItem>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          logoutMutation.mutate();
        }}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? t("Выходим...") : t("Выйти")}
      </DropdownMenuItem>
    </>
  );
}
