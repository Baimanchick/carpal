import { Suspense } from "react";
import { getTranslations } from "@/i18n/server";
import { AuthScreen } from "@/features/auth/components/auth-screen";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("Войти"),
  };
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen />
    </Suspense>
  );
}
