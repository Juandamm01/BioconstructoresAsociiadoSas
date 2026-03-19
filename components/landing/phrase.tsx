"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function Phrase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(containerRef.current, { perspective: 2000 });

    const items = gsap.utils.toArray<HTMLElement>(".bento-item");
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Móvil: Asegurar que inician visibles y rebotan arriba
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
      // Desktop: Ensamblaje Magnético 3D (Animación al Scrollear Mágica)
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
          end: "+=1200",
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
        ease: "power3.out",
        stagger: {
          amount: 0.4,
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
      ref={containerRef}
      // Se restauró el fondo original pero MUCHO padding superior para alejar el Navbar
      className="relative min-h-screen z-50 bg-linear-to-b from-blue-950 from-0% to-white to-45% 
      overflow-hidden px-4 md:px-10 pt-36 md:pt-48 pb-24 md:pb-32 flex flex-col items-center"
    >
      <div
        ref={gridRef}
        // En Móvil: Flex-col puro para que nada se corte. En PC: Grid 4x3 perfecto.
        className="w-full max-w-5xl flex flex-col md:grid md:grid-cols-4 md:grid-rows-3 gap-6 md:gap-5 relative z-10"
      >
        {/* ── TARJETA 1 (HERO/LÍDER) ── */}
        <div className="bento-item md:col-span-2 md:row-span-3 group relative overflow-hidden bg-white/20 backdrop-blur-md border border-blue-100/30 p-8 rounded-[2rem] shadow-xl flex flex-col justify-center">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src="/images/bcas-logo.png"
            alt="BCAS Logo"
            width={80}
            height={80}
            className="bcas-logo-main w-16 md:w-20 mb-4 drop-shadow-md"
            priority
          />
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-blue-950 leading-tight tracking-tight">
            Nuestros <br />
            <span className="text-blue-950">
              Planes
            </span>
          </h2>
          <p className="mt-2 md:mt-4 text-blue-950 text-sm md:text-base font-light max-w-sm leading-snug">
            Internet de fibra óptica hiper veloz para tu hogar y negocio.
          </p>
        </div>

        {/* ── TARJETA 2 (HORARIOS) ── */}
        <div className="bento-item md:col-span-2 md:row-span-1 bg-white/20 backdrop-blur-md border border-blue-100/30 p-6 md:p-8 rounded-[2rem] shadow-lg flex flex-col justify-center">
          <h3 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2">
            <span className="bg-blue-100/50 text-blue-950 p-1.5 rounded-md text-sm">🕒</span> Horarios de Atención
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-blue-950">
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

        {/* ── CARRUSEL MOVILES Y ENCABEZES DESKTOP ── */}
        {/* IMPORTANTE: En móvil es horizontal para AHORRAR espacio vertical gigante. En PC es Grid. */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 w-[100vw] ml-[-1rem] px-[1rem] md:w-auto md:ml-0 md:px-0 md:pb-0 md:contents hide-scrollbar">

          {/* ── ZONA 2 (La Nohora) ── */}
          <div className="bento-item shrink-0 snap-center w-[85vw] md:w-auto md:col-span-1 md:row-span-1 bg-white/20 backdrop-blur-md border border-blue-100/30 p-5 md:p-6 rounded-[2rem] shadow-lg text-blue-950 flex flex-col justify-center">
            <h4 className="font-bold text-sm leading-tight mb-2">La Nohora y San Luis</h4>
            <p className="text-blue-950 font-bold mb-3 text-xs">Susc.: $89.000</p>
            <ul className="space-y-1.5 text-xs text-blue-950">
              <li className="flex justify-between border-b border-blue-950/5 pb-0.5">
                <span>50MB +1TV</span> <span className="font-bold text-blue-950">$68K</span>
              </li>
              <li className="flex justify-between border-b border-blue-950/5 pb-0.5">
                <span>100MB +2TV</span> <span className="font-bold text-blue-950">$95K</span>
              </li>
              <li className="flex justify-between text-blue-950">
                <span>200MB +2TV</span> <span className="font-bold text-blue-950">$105K</span>
              </li>
            </ul>
          </div>

          {/* ── ZONA 3 (La Zuria) ── */}
          <div className="bento-item shrink-0 snap-center w-[85vw] md:w-auto md:col-span-1 md:row-span-1 bg-white/20 backdrop-blur-md border border-blue-100/30 p-5 md:p-6 rounded-[2rem] shadow-lg text-blue-950 flex flex-col justify-center">
            <h4 className="font-bold text-sm leading-tight mb-2 text-blue-950">La Zuria</h4>
            <p className="text-blue-950 font-bold mb-3 text-xs">Susc.: $89.000</p>
            <ul className="space-y-1.5 text-xs text-blue-950">
              <li className="flex justify-between border-b border-blue-950/5 pb-0.5">
                <span>50MB +1TV</span> <span className="font-bold text-blue-950">$105K</span>
              </li>
              <li className="flex justify-between border-b border-blue-950/5 pb-0.5">
                <span>25MB +1TV</span> <span className="font-bold text-blue-950">$85K</span>
              </li>
              <li className="flex justify-between text-blue-950">
                <span>25MB Solo</span> <span className="font-bold text-blue-950">$75K</span>
              </li>
            </ul>
          </div>

          {/* ── ZONA 1 (Premium - Mesetas) ── */}
          <div className="bento-item shrink-0 snap-center w-[85vw] md:w-auto md:col-span-2 md:row-span-1 bg-white/20 backdrop-blur-md border border-blue-100/30 text-blue-950 p-5 md:p-6 rounded-[2rem] shadow-xl flex flex-col justify-center">
            <div className="space-y-3">
              <h4 className="font-bold text-sm md:text-base leading-tight">
                Mesetas, El Triángulo, La Sultana, Rondinella, 12 de Octubre
              </h4>
              <p className="inline-block bg-blue-100 text-blue-950 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
                $99.000 Susc.
              </p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between border-b border-blue-950/5 pb-1">
                  <span>50 MB - $68K</span> <span className="text-blue-950 font-bold">+1 TV</span>
                </li>
                <li className="flex justify-between border-b border-blue-950/5 pb-1">
                  <span>100 MB - $95K</span> <span className="text-blue-950 font-bold">+2 TV</span>
                </li>
                <li className="flex justify-between text-blue-950">
                  <span>200 MB - $105K</span> <span className="text-blue-950 font-bold">+2 TV</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}