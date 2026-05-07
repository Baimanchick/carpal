import type { Review } from "@/lib/types";

const AVATAR = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;

export const REVIEWS: Review[] = [
  {
    id: "r-1",
    carId: "c-1",
    authorName: "Lukas",
    authorCountry: "Germany",
    authorAvatar: AVATAR("Lukas"),
    rating: 5,
    date: "2026-03-12",
    text: "Aibek met us at the airport at 6 AM, walked us through the car for 20 minutes, and even installed a SIM card. The Prado handled Son-Kul without a problem.",
    trip: "Bishkek → Son-Kul → Naryn",
  },
  {
    id: "r-2",
    carId: "c-6",
    authorName: "Mei",
    authorCountry: "Singapore",
    authorAvatar: AVATAR("Mei"),
    rating: 5,
    date: "2026-02-28",
    text: "We did Pamir Highway in 9 days. The Hilux was immaculate, host gave us snow chains for free. Best decision we made on this trip.",
    trip: "Osh → Pamir → Sary-Tash",
  },
  {
    id: "r-3",
    carId: "c-3",
    authorName: "Pierre",
    authorCountry: "France",
    authorAvatar: AVATAR("Pierre"),
    rating: 4,
    date: "2026-02-10",
    text: "It’s a Niva, so don’t expect comfort. But it goes anywhere. Erlan answered my texts even at midnight when we got stuck.",
    trip: "Karakol → Son-Kul",
  },
  {
    id: "r-4",
    carId: "c-2",
    authorName: "Sarah",
    authorCountry: "UK",
    authorAvatar: AVATAR("Sarah"),
    rating: 5,
    date: "2026-04-02",
    text: "Smooth experience from booking to drop-off. The escrow flow gave us peace of mind. Will rent again.",
    trip: "Bishkek → Issyk-Kul",
  },
];

export const TESTIMONIALS = REVIEWS;
