import { setRequestLocale } from "next-intl/server";
import { HeroSearch } from "@/components/home/hero-search";
import { PopularDestinations } from "@/components/home/popular-destinations";
import { LeadForms } from "@/features/leads/components/lead-forms";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSearch />
      <PopularDestinations />
      <LeadForms />
    </>
  );
}
