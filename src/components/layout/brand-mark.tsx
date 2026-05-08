import { cn } from "@/lib/utils";

const SIZE_STYLES = {
  sm: {
    text: "text-base",
  },
  md: {
    text: "text-lg",
  },
} as const;

export function BrandMark({
  size = "sm",
  className,
  textClassName,
}: {
  size?: keyof typeof SIZE_STYLES;
  className?: string;
  textClassName?: string;
}) {
  const styles = SIZE_STYLES[size];

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold tracking-tight",
        className,
      )}
    >
      <span className={cn(styles.text, textClassName)}>CarPal</span>
    </span>
  );
}
