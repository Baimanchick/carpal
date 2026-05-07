import { ShieldCheck, Mountain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "md" | "lg";
  earned?: boolean;
  className?: string;
}

export function RoadReadyBadge({ size = "md", earned = true, className }: Props) {
  const sizes = {
    sm: { wrap: "size-20", icon: "size-6", title: "text-[9px]", num: "text-[10px]" },
    md: { wrap: "size-32", icon: "size-9", title: "text-[11px]", num: "text-xs" },
    lg: { wrap: "size-44", icon: "size-12", title: "text-xs", num: "text-sm" },
  } as const;
  const s = sizes[size];

  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-full",
        s.wrap,
        earned
          ? "bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-amber-950"
          : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        className,
      )}
    >
      {/* outer ring */}
      <div
        className={cn(
          "absolute inset-1 rounded-full ring-2",
          earned ? "ring-amber-100/40" : "ring-zinc-300/40",
        )}
      />
      <div
        className={cn(
          "absolute inset-2 rounded-full border-2 border-dashed",
          earned ? "border-amber-100/30" : "border-zinc-400/40",
        )}
      />

      {/* mountain inside */}
      <Mountain className={cn(s.icon, "relative z-10")} />

      {/* top label */}
      <span
        className={cn(
          "absolute top-3 left-1/2 -translate-x-1/2 font-bold uppercase tracking-[0.2em]",
          s.title,
        )}
      >
        Road Ready
      </span>

      {/* bottom label */}
      <span
        className={cn(
          "absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-950/15 px-1.5 py-0.5 font-semibold tabular-nums backdrop-blur-sm",
          s.num,
        )}
      >
        <ShieldCheck className="size-3" />
        CarPal
      </span>

      {/* sparkle decoration */}
      {earned ? (
        <Sparkles className="absolute -right-1 -top-1 size-5 text-amber-300 drop-shadow" />
      ) : null}
    </div>
  );
}
