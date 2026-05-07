import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const t = await getTranslations();
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("Машина не найдена")}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("Этот автомобиль больше не размещён или ссылка повреждена.")}
      </p>
      <Link href="/cars" className={cn(buttonVariants(), "mt-6")}>
        {t("Все машины")}
      </Link>
    </div>
  );
}
