import { CarsSearchPage } from "@/components/cars/cars-search-page";
import { listCars, localeToLang } from "@/services/cars/cars.server";
import { getTranslations } from "@/i18n/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("Найти машину"),
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    city?: string;
    from?: string;
    to?: string;
    travellers?: string;
    drivetrain?: string;
    route?: string;
    experience?: string;
  }>;
}

export default async function CarsPage({ params, searchParams }: PageProps) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const { items } = await listCars({
    lang: localeToLang(locale),
    city: sp.city,
    drivetrain: sp.drivetrain,
    routeTag: sp.route,
  });

  return (
    <CarsSearchPage
      cars={items}
      initial={{
        city: sp.city,
        from: sp.from,
        to: sp.to,
        travellers: sp.travellers ? Number(sp.travellers) : undefined,
        only4x4: sp.drivetrain === "4x4",
        route: sp.route,
        experience: sp.experience,
      }}
    />
  );
}
