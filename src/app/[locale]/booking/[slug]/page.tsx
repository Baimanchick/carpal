import { notFound } from "next/navigation";
import { getCar } from "@/lib/mock/cars";
import { BookingFlow } from "@/components/booking/booking-flow";
import { getTranslations } from "@/i18n/server";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    insurance?: string;
  }>;
}

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("Оформление"),
  };
}

export default async function BookingPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const car = getCar(slug);
  if (!car) notFound();

  return (
    <BookingFlow
      car={car}
      initial={{
        from: sp.from,
        to: sp.to,
        insurance: sp.insurance === "1",
      }}
    />
  );
}
