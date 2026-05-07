import { SafeRouteMap } from "@/components/map/safe-route-map";

export const metadata = {
  title: "Карта безопасности",
  description:
    "Карта безопасности Кыргызстана на 2GIS. Переключайте слои: опасные участки, смотровые точки, заправки и доступные машины.",
};

export default function MapPage() {
  return <SafeRouteMap />;
}
