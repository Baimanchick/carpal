import { getTranslations } from "@/i18n/server";
import { SafeRouteMap } from "@/components/map/safe-route-map";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("Карта безопасности"),
    description: t(
      "Карта безопасности Кыргызстана на 2GIS. Переключайте слои: опасные участки, смотровые точки, заправки и доступные машины.",
    ),
  };
}

export default function MapPage() {
  return <SafeRouteMap />;
}
