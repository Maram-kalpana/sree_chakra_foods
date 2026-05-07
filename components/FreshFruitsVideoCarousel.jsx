"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { FRESH_FRUITS_VIDEO_CLIPS } from "@/lib/homeSectionsDummy";

function ProduceClipVideo({ item, active }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.muted = true;
      const p = el.play?.();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    } else {
      el.pause();
    }
  }, [active]);

  return (
    <video
      ref={ref}
      className="aspect-[3/4] w-full object-cover"
      poster={item.poster}
      muted
      playsInline
      loop
      preload={active ? "auto" : "metadata"}
    >
      {item.sources?.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}

export default function FreshFruitsVideoCarousel() {
  const [api, setApi] = useState(undefined);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="mt-10 sm:mt-12">
      <h2 className="text-center text-xl font-bold tracking-tight text-[#99ca20] sm:text-2xl">
        Fresh Fruits &amp; Vegetables
      </h2>

      <div className="relative mx-auto mt-6 min-h-[420px] max-w-[1320px] pb-14 sm:min-h-[440px]">
        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: true, dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-0 gap-4 px-1 sm:gap-5 sm:px-4 md:gap-6">
            {FRESH_FRUITS_VIDEO_CLIPS.map((item, idx) => {
              const active = current === idx;
              return (
                <CarouselItem
                  key={item.id}
                  className="flex basis-[78%] justify-center pl-0 sm:basis-[56%] md:basis-[44%] lg:basis-[36%]"
                >
                  <div
                    className={cn(
                      "flex w-full max-w-[320px] flex-col transition-all duration-500 ease-out sm:max-w-[380px]",
                      active ? "md:scale-[1.06]" : "md:scale-[0.92] opacity-95",
                      active ? "z-10" : "z-0",
                    )}
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-lg">
                      <ProduceClipVideo item={item} active={active} />
                    </div>

                    <div className="mt-3 flex items-center gap-3 px-1">
                      <img
                        src={item.thumb}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-md border border-gray-200 bg-white object-cover"
                      />
                      <p className="text-sm font-semibold leading-snug text-gray-900">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="bottom-auto left-1 top-[38%] z-10 h-9 w-9 -translate-y-1/2 rounded-full border-gray-300 bg-white text-gray-600 shadow-md hover:bg-white disabled:opacity-30 sm:left-2 md:left-0" />
          <CarouselNext className="bottom-auto right-1 top-[38%] z-10 h-9 w-9 -translate-y-1/2 rounded-full border-gray-300 bg-white text-gray-600 shadow-md hover:bg-white disabled:opacity-30 sm:right-2 md:right-0" />
        </Carousel>
      </div>
    </section>
  );
}

