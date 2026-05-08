import { notFound } from "next/navigation";
import { getCar } from "@/lib/mock/cars";
import { BookingFlow } from "@/components/booking/booking-flow";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    insurance?: string;
  }>;
}

export const metadata = {
  title: "Оформление",
};

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
