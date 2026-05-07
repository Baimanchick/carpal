import type { Host } from "@/lib/types";

export const HOSTS: Host[] = [
  {
    id: "h-aibek",
    name: "Aibek",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aibek",
    rating: 4.95,
    trips: 142,
    responseRate: 99,
    languages: ["ru", "kg", "en"],
    isPro: true,
    joinedYear: 2022,
  },
  {
    id: "h-nurzat",
    name: "Nurzat",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Nurzat",
    rating: 4.88,
    trips: 87,
    responseRate: 97,
    languages: ["ru", "en"],
    joinedYear: 2023,
  },
  {
    id: "h-erlan",
    name: "Erlan",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Erlan",
    rating: 4.92,
    trips: 211,
    responseRate: 100,
    languages: ["ru", "kg", "en"],
    isPro: true,
    joinedYear: 2021,
  },
  {
    id: "h-aichurek",
    name: "Aichurek",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aichurek",
    rating: 4.79,
    trips: 53,
    responseRate: 95,
    languages: ["ru", "en"],
    joinedYear: 2024,
  },
  {
    id: "h-bakyt",
    name: "Bakyt",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bakyt",
    rating: 4.97,
    trips: 318,
    responseRate: 100,
    languages: ["ru", "kg", "en"],
    isPro: true,
    joinedYear: 2020,
  },
];

export function getHost(id: string): Host | undefined {
  return HOSTS.find((h) => h.id === id);
}
