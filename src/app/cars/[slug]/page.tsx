import { notFound } from "next/navigation";
import { CARS, getCar } from "@/lib/mock/cars";
import { getHost } from "@/lib/mock/hosts";
import { REVIEWS } from "@/lib/mock/reviews";
import { PhotoGallery } from "@/components/cars/detail/photo-gallery";
import { CarHeader } from "@/components/cars/detail/car-header";
import { SpecsGrid } from "@/components/cars/detail/specs-grid";
import { FeaturesList } from "@/components/cars/detail/features-list";
import { RouteCompatibility } from "@/components/cars/detail/route-compatibility";
import { OwnerCard } from "@/components/cars/detail/owner-card";
import { ReviewsSection } from "@/components/cars/detail/reviews-section";
import { CancellationPolicy } from "@/components/cars/detail/cancellation-policy";
import { SafetyStatus } from "@/components/cars/detail/safety-status";
import { BookingWidget } from "@/components/cars/detail/booking-widget";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CARS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) return { title: "Машина не найдена" };
  return {
    title: `${car.make} ${car.model} ${car.year} · ${car.city}`,
    description: car.description,
  };
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) notFound();

  const host = getHost(car.hostId);
  const carReviews = REVIEWS.filter((r) => r.carId === car.id);
  const displayReviews = carReviews.length >= 2 ? carReviews : REVIEWS;

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PhotoGallery photos={car.photos} alt={`${car.make} ${car.model}`} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <CarHeader car={car} />

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {car.description}
            </p>

            <SpecsGrid car={car} />
            <FeaturesList car={car} />
            <RouteCompatibility car={car} />
            <SafetyStatus car={car} />
            {host ? <OwnerCard host={host} /> : null}
            <ReviewsSection
              reviews={displayReviews}
              rating={car.rating}
              reviewsCount={car.reviewsCount}
            />
            <CancellationPolicy />
          </div>

          <div className="lg:sticky lg:top-20 lg:h-fit">
            <BookingWidget car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
