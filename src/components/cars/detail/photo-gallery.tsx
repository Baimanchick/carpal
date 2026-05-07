"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "@/i18n/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Heart, Share2, Images } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  photos: string[];
  alt: string;
}

export function PhotoGallery({ photos, alt }: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const padded = [...photos, ...photos, ...photos].slice(0, 5);

  return (
    <>
      <div className="relative grid h-[420px] grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:h-[480px] lg:grid-cols-4 lg:grid-rows-2">
        <button
          type="button"
          onClick={() => {
            setActive(0);
            setOpen(true);
          }}
          className="relative h-full overflow-hidden rounded-2xl lg:col-span-2 lg:row-span-2 lg:rounded-r-none"
        >
          <Image
            src={padded[0]}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            priority
          />
        </button>

        {[1, 2, 3, 4].map((i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              setActive(i);
              setOpen(true);
            }}
            className={cn(
              "relative hidden overflow-hidden rounded-2xl lg:block",
              i === 1 && "lg:rounded-l-none lg:rounded-tr-2xl",
              i === 2 && "lg:rounded-none lg:rounded-tr-2xl",
              i === 3 && "lg:rounded-l-none",
              i === 4 && "lg:rounded-l-none lg:rounded-tr-none lg:rounded-br-2xl",
            )}
          >
            <Image
              src={padded[i]}
              alt={`${alt} ${i}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.05]"
            />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md ring-1 ring-foreground/5 backdrop-blur"
        >
          <Images className="size-3.5" />
          {t("Все фото — {count}", { count: photos.length })}
        </button>

        <div className="absolute top-4 right-4 hidden gap-2 lg:flex">
          <IconAction>
            <Heart className="size-4" />
          </IconAction>
          <IconAction>
            <Share2 className="size-4" />
          </IconAction>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">
            {t("Фото: {alt}", { alt })}
          </DialogTitle>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
            <Image
              src={padded[active]}
              alt={`${alt} ${active}`}
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {padded.map((p, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-md ring-1 ring-border",
                  i === active && "ring-2 ring-foreground",
                )}
              >
                <Image
                  src={p}
                  alt={`thumb ${i}`}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function IconAction({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="grid size-9 place-items-center rounded-full bg-background/95 text-foreground shadow-md ring-1 ring-foreground/5 backdrop-blur transition-colors hover:bg-background"
    >
      {children}
    </button>
  );
}
