"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

interface InfiniteTextProps {
  /** Texto que se moverá infinitamente */
  text: string;
  /** Velocidad de desplazamiento (cuanto mayor, más lento) */
  speed?: number;
  /** Dirección del movimiento */
  direction?: "left" | "right";
  /** Clases adicionales de Tailwind o personalizadas */
  className?: string;
}
export function InfiniteText({
  text,
  speed = 50,
  direction = "left",
  className = "",
}: InfiniteTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const distance = direction === "left" ? "-100%" : "100%";

      gsap.to(".marquee-inner", {
        x: distance,
        duration: speed,
        repeat: -1,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap w-full border-y-[.5vw] border-[#a26833] -rotate-3 ${className}`}
    >
      <div className="marquee-inner flex gap-10">
        {[...Array(3)].map((_, i) => (
          <h1
            key={i}
            className="uppercase text-[8vw] font-bold tracking-tight text-[#fce1cd]"
          >
            {text}
          </h1>
        ))}
      </div>
    </div>
  );
}
