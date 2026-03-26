"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function Plans() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(containerRef.current, { perspective: 2000 });

    const items = gsap.utils.toArray<HTMLElement>(".bento-item");
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: item,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    } else {
      items.forEach((item) => {
        gsap.set(item, {
          opacity: 0,
          z: gsap.utils.random(-800, 800),
          rotationX: gsap.utils.random(-40, 40),
          rotationY: gsap.utils.random(-40, 40),
          x: gsap.utils.random(-600, 600),
          y: gsap.utils.random(-400, 400),
          scale: gsap.utils.random(0.5, 0.8),
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "+=1000",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(items, {
        opacity: 1,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        stagger: {
          amount: 0.8,
          from: "center",
        },
      });
    }

    gsap.to(".bcas-logo-main", {
      y: -10,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  });

  return (
    <section
      id="plans"
      ref={containerRef}
      className="relative min-h-screen z-50 bg-linear-to-b from-blue-950 from-0% to-white to-45% 
      overflow-hidden px-3 md:px-10 pt-16 md:pt-32 flex flex-col items-center justify-center font-poppins"
    >
      <div
        ref={gridRef}
        className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-6 auto-rows-[120px] md:auto-rows-[200px] gap-2 md:gap-6 relative z-10"
      >
        {/* ── TARJETA 1 (HERO/LÍDER) ── */}
        <div className="bento-item col-span-2 md:col-span-3 group relative overflow-hidden bg-white/20 backdrop-blur-md border border-blue-100/30 p-2 md:p-6 rounded-[1.3rem] md:rounded-[2rem] shadow-xl flex flex-row items-center gap-3 md:gap-6">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src="/images/bcas-logo.png"
            alt="BCAS Logo"
            width={48}
            height={48}
            className="bcas-logo-main w-7 md:w-12 drop-shadow-md"
            priority
          />
          <div>
            <h2 className="text-base md:text-2xl font-bold font-poppins text-blue-950 leading-tight tracking-tight">
              Nuestros <span className="text-blue-950">Planes</span>
            </h2>
            <p className="mt-1 text-blue-950 text-[10px] md:text-sm font-light leading-snug">
              Fibra óptica hiper veloz para tu hogar y negocio.
            </p>
          </div>
        </div>

        {/* ── TARJETA 2 (HORARIOS) ── */}
        <div className="bento-item col-span-2 md:col-span-3 bg-white/20 backdrop-blur-md border border-blue-100/30 p-2 md:p-6 rounded-[1.3rem] md:rounded-[2rem] shadow-lg flex flex-col justify-center">
          <h3 className="text-xs md:text-lg font-bold text-blue-950 mb-1 md:mb-3 flex items-center gap-2">
            <span className="bg-blue-100/50 text-blue-950 p-1 rounded-md text-[10px] md:text-sm">🕒</span> Horarios de Atención
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 md:gap-x-6 gap-y-1 text-[10px] md:text-sm text-blue-950">
            <div className="flex justify-between border-b border-blue-950/10 pb-1">
              <span className="font-semibold text-blue-950">Lun - Vie</span>
              <span>8am - 12pm / 2pm - 5pm</span>
            </div>
            <div className="flex justify-between border-b border-blue-950/10 pb-1">
              <span className="font-semibold text-blue-950">Sábados</span>
              <span>8am - 1pm</span>
            </div>
            <div className="flex justify-between text-blue-950 font-semibold sm:col-span-2 pt-1">
              <span>Domingos</span>
              <span>Cerrado</span>
            </div>
          </div>
        </div>

        {/* ── ZONA 2 (La Nohora) ── */}
        <div className="bento-item col-span-1 md:col-span-2 bg-white/20 backdrop-blur-md border border-blue-100/30 p-1.5 md:p-5 rounded-[1.3rem] md:rounded-[2rem] shadow-lg text-blue-950 flex flex-col justify-center">
          <h4 className="font-bold text-[9px] md:text-sm leading-tight mb-1">La Nohora y San Luis</h4>
          <p className="text-blue-950 font-bold mb-1 text-[9px] md:text-xs">Susc.: $89.000</p>
          <ul className="space-y-0.5 text-[9px] md:text-xs text-blue-950">
            <li className="flex justify-between">
              <span>50MB +1TV</span> <span className="font-bold text-blue-950">$68K</span>
            </li>
            <li className="flex justify-between">
              <span>100MB +2TV</span> <span className="font-bold text-blue-950">$95K</span>
            </li>
            <li className="flex justify-between">
              <span>200MB +2TV</span> <span className="font-bold text-blue-950">$105K</span>
            </li>
          </ul>
        </div>

        {/* ── ZONA 3 (La Zuria) ── */}
        <div className="bento-item col-span-1 md:col-span-2 bg-white/20 backdrop-blur-md border border-blue-100/30 p-1.5 md:p-5 rounded-[1.3rem] md:rounded-[2rem] shadow-lg text-blue-950 flex flex-col justify-center">
          <h4 className="font-bold text-[9px] md:text-sm leading-tight mb-1 text-blue-950">La Zuria</h4>
          <p className="text-blue-950 font-bold mb-1 text-[9px] md:text-xs">Susc.: $89.000</p>
          <ul className="space-y-0.5 text-[9px] md:text-xs text-blue-950">
            <li className="flex justify-between">
              <span>50MB +1TV</span> <span className="font-bold text-blue-950">$105K</span>
            </li>
            <li className="flex justify-between">
              <span>25MB +1TV</span> <span className="font-bold text-blue-950">$85K</span>
            </li>
            <li className="flex justify-between">
              <span>25MB Solo</span> <span className="font-bold text-blue-950">$75K</span>
            </li>
          </ul>
        </div>

        {/* ── ZONA 1 (Premium - Mesetas) ── */}
        <div className="bento-item col-span-2 md:col-span-2 bg-white/20 backdrop-blur-md border border-blue-100/30 text-blue-950 p-1.5 md:p-5 rounded-[1.3rem] md:rounded-[2rem] shadow-xl flex flex-col justify-center">
          <div className="space-y-1.5 md:space-y-3">
            <h4 className="font-bold text-[9px] md:text-base leading-tight">
              Mesetas, El Triángulo, La Sultana, Rondinella, 12 de Octubre
            </h4>
            <p className="inline-block bg-blue-100 text-blue-950 text-[9px] md:text-xs font-bold px-2 py-0.5 rounded-full">
              $99.000 Susc.
            </p>
            <ul className="space-y-0.5 text-[9px] md:text-xs">
              <li className="flex justify-between">
                <span>50 MB - $68K</span> <span className="text-blue-950 font-bold">+1 TV</span>
              </li>
              <li className="flex justify-between">
                <span>100 MB - $95K</span> <span className="text-blue-950 font-bold">+2 TV</span>
              </li>
              <li className="flex justify-between">
                <span>200 MB - $105K</span> <span className="text-blue-950 font-bold">+2 TV</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}