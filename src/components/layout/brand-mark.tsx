import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZE_STYLES = {
  sm: {
    icon: "size-8 rounded-lg",
    text: "text-base",
    imageSizes: "32px",
  },
  md: {
    icon: "size-10 rounded-xl",
    text: "text-lg",
    imageSizes: "40px",
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
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <span
        className={cn(
          "relative overflow-hidden border border-border/60 bg-black shadow-sm",
          styles.icon,
        )}
      >
        <Image
          src="/icon.jpg"
          alt=""
          fill
          sizes={styles.imageSizes}
          className="object-cover"
        />
      </span>
      <span className={cn(styles.text, textClassName)}>CarPal</span>
    </span>
  );
}
