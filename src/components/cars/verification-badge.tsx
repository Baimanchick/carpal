import { useTranslations } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { BADGE_META, TONE_CLASSES, normalizeBadgeKey } from "@/lib/badges";

interface Props {
  kind: string;
  size?: "sm" | "md";
  className?: string;
  iconOnly?: boolean;
}

export function VerificationBadge({
  kind,
  size = "sm",
  className,
  iconOnly,
}: Props) {
  const t = useTranslations();
  const normalizedKey = normalizeBadgeKey(kind);
  const meta = normalizedKey ? BADGE_META[normalizedKey] : null;

  if (!meta) {
    return null;
  }

  const Icon = meta.icon;

  return (
    <span
      title={t(meta.description)}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-xs",
        TONE_CLASSES[meta.tone],
        className,
      )}
    >
      <Icon className={cn(size === "sm" ? "size-3" : "size-3.5")} />
      {!iconOnly && t(meta.label)}
    </span>
  );
}
