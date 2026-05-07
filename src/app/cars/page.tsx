import { CARS } from "@/lib/mock/cars";
import { CarsSearchPage } from "@/components/cars/cars-search-page";

export const metadata = {
  title: "Найти машину",
};

interface PageProps {
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

export default async function CarsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <CarsSearchPage
      cars={CARS}
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
