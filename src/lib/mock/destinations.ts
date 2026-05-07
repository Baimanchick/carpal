import type { Destination } from "@/lib/types";

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;

export const DESTINATIONS: Destination[] = [
  {
    id: "son-kul",
    name: "Son-Kul",
    region: "Naryn region",
    imageUrl: u("1601581875309-fafbf2d3ed3a"),
    carsCount: 32,
    difficulty: "hard",
    blurb: "High alpine lake, yurts, dirt roads — needs a 4x4.",
  },
  {
    id: "issyk-kul",
    name: "Issyk-Kul",
    region: "Issyk-Kul region",
    imageUrl: u("1506905925346-21bda4d32df4"),
    carsCount: 84,
    difficulty: "easy",
    blurb: "The big lake — beaches, hot springs, easy paved roads.",
  },
  {
    id: "ala-archa",
    name: "Ala-Archa",
    region: "Chuy region",
    imageUrl: u("1464822759023-fed622ff2c3b"),
    carsCount: 47,
    difficulty: "easy",
    blurb: "Mountain park 40 km from Bishkek. Day trip friendly.",
  },
  {
    id: "karakol",
    name: "Karakol",
    region: "Issyk-Kul region",
    imageUrl: u("1502786129293-79981df4e689"),
    carsCount: 26,
    difficulty: "moderate",
    blurb: "Skiing, hot springs, hiking. Winter-ready vehicles only.",
  },
  {
    id: "chon-kemin",
    name: "Chon-Kemin",
    region: "Chuy region",
    imageUrl: u("1469854523086-cc02fe5d8800"),
    carsCount: 19,
    difficulty: "moderate",
    blurb: "Quiet valley, horse trails, river camping.",
  },
  {
    id: "pamir",
    name: "Pamir Highway",
    region: "Osh region",
    imageUrl: u("1550355291-bbee04a92027"),
    carsCount: 12,
    difficulty: "hard",
    blurb: "M41 epic. 4x4 only, with snorkel preferred.",
  },
];
