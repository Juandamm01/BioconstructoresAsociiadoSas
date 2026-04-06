"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Settings2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Plans() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  const [schedule, setSchedule] = useState({
    dia1: "Lun - Vie", hora1: "8am - 12pm / 2pm - 5pm",
    dia2: "Sábados", hora2: "8am - 1pm",
    dia3: "Domingos", hora3: "Cerrado"
  });

  const [groups, setGroups] = useState<any[]>([
    { title: "La Nohora y San Luis", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{ name: "50MB +1TV", price: "$68K" }, { name: "100MB +2TV", price: "$95K" }, { name: "200MB +2TV", price: "$105K" }] },
    { title: "La Zuria", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{ name: "50MB +1TV", price: "$105K" }, { name: "25MB +1TV", price: "$85K" }, { name: "25MB Solo", price: "$75K" }] },
    { title: "Mesetas, El Triángulo, La Sultana, Rondinella, 12 de Octubre", subtitle: "", badge: "$99.000 Susc.", isPremium: true, items: [{ name: "50 MB - $68K", price: "+1 TV" }, { name: "100 MB - $95K", price: "+2 TV" }, { name: "200 MB - $105K", price: "+2 TV" }] }
  ]);

  useEffect(() => {
    setMounted(true);
    fetch("/api/plans", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.schedule) setSchedule(data.schedule);
        if (data.groups && data.groups.length > 0) setGroups(data.groups);
      })
      .catch(err => console.error("Error fetching plans:", err));
  }, []);

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
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    } else {
      // Animación 3D original para PC restaurada con su "Freno de pantalla" original.
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
      ScrollTrigger.getAll().filter(st => st.trigger === containerRef.current).forEach(st => st.kill());
    };
  }, { scope: containerRef });

  return (
    <section
      id="plans"
      ref={containerRef}
      className="relative min-h-[100dvh] z-50 bg-gradient-to-b from-blue-950 via-white to-white 
      overflow-x-hidden px-4 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24 flex flex-col items-center justify-start md:justify-center font-poppins"
    >
      <div
        ref={gridRef}
        className="w-[98%] max-w-[320px] lg:max-w-4xl flex flex-wrap justify-center items-stretch gap-2 lg:gap-4 relative z-10 mx-auto"
      >
        {/* ── TARJETA 1 (HERO/LÍDER) ── */}
        <div className="bento-item w-full lg:w-[55%] flex-1 group relative overflow-hidden bg-white/20 backdrop-blur-md border border-blue-100/30 p-2.5 lg:p-5 rounded-[1.2rem] lg:rounded-[1.5rem] shadow-xl flex flex-row items-center gap-2.5 lg:gap-5 text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src="/images/bcas-logo.png"
            alt="BCAS Logo"
            width={64}
            height={64}
            className="bcas-logo-main w-8 lg:w-14 drop-shadow-md shrink-0"
            priority
          />
          <div className="min-w-0">
            <h2 className="text-[13px] lg:text-2xl font-bold font-poppins text-blue-950 leading-tight tracking-tight">
              Nuestros <span className="text-blue-950">Planes</span>
            </h2>
            <p className="mt-0.5 lg:mt-1.5 text-blue-950 text-[9px] lg:text-sm font-light leading-snug">
              Fibra óptica hiper veloz para tu hogar.
            </p>
          </div>
        </div>

        {/* ── TARJETA 2 (HORARIOS) ── */}
        <div className="bento-item w-full lg:w-[40%] flex-none bg-white/20 backdrop-blur-md border border-blue-100/30 p-2.5 lg:p-5 rounded-[1.2rem] lg:rounded-[1.5rem] shadow-lg flex flex-col justify-center">
          <h3 className="text-[11px] lg:text-lg font-bold text-blue-950 mb-1.5 lg:mb-3 flex items-center justify-center lg:justify-start gap-1 lg:gap-1.5">
            <span className="bg-blue-100/50 text-blue-950 p-1 lg:p-1.5 rounded-[0.4rem] text-[9px] lg:text-[13px]">🕒</span> Horarios de Atención
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 lg:gap-x-3 gap-y-0.5 lg:gap-y-1 text-[9px] lg:text-[11px] text-blue-950">
            <div className="flex justify-between border-b border-blue-950/10 pb-1">
              <span className="font-semibold text-blue-950">{schedule.dia1}</span>
              <span>{schedule.hora1}</span>
            </div>
            <div className="flex justify-between border-b border-blue-950/10 pb-1">
              <span className="font-semibold text-blue-950">{schedule.dia2}</span>
              <span>{schedule.hora2}</span>
            </div>
            <div className="flex justify-between text-blue-950 font-semibold sm:col-span-2 pt-0.5 border-t border-blue-100/10 hidden sm:flex">
              <span>{schedule.dia3}</span>
              <span>{schedule.hora3}</span>
            </div>
          </div>
        </div>

        {/* ── GRUPOS DE PRECIOS DINÁMICOS ── */}
        {groups.map((group, i) => (
          <div key={i} className={`bento-item flex-1 min-w-[130px] lg:min-w-[200px] max-w-[48%] lg:max-w-[32%] ${group.isPremium ? 'shadow-lg lg:shadow-xl shadow-blue-900/10' : 'shadow-md lg:shadow-lg'} bg-white/20 backdrop-blur-md border border-blue-100/30 p-2.5 lg:p-4 rounded-[1rem] lg:rounded-[1.3rem] text-blue-950 flex flex-col justify-center`}>
            {group.isPremium ? (
              <div className="space-y-1 lg:space-y-1.5">
                <h4 className="font-bold text-[9px] lg:text-[14px] leading-tight">{group.title}</h4>
                {group.badge && (
                  <p className="inline-block bg-blue-950 text-white px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-full text-[8px] lg:text-[10px] font-bold shadow-md">
                    {group.badge}
                  </p>
                )}
                <ul className="space-y-0.5 lg:space-y-1 text-[8.5px] lg:text-[11px] text-blue-950 mt-1 lg:mt-1.5">
                  {group.items.map((item: any, j: number) => (
                    <li key={j} className="flex justify-between border-b border-blue-950/5 pb-0.5 lg:pb-1 mb-0.5 lg:mb-1 last:border-0 gap-1">
                      <span className="text-left font-medium min-w-0 break-words">{item.name}</span> <span className="text-blue-950 font-bold text-right whitespace-nowrap">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <h4 className="font-bold text-[9px] lg:text-[13px] leading-tight mb-0.5 lg:mb-1 text-blue-950">{group.title}</h4>
                {group.subtitle && <p className="text-blue-950 font-bold mb-1 lg:mb-1.5 text-[8.5px] lg:text-[10px]">{group.subtitle}</p>}
                <ul className="space-y-0.5 lg:space-y-1 text-[8.5px] lg:text-[11px] text-blue-950 mt-1 lg:mt-1.5">
                  {group.items.map((item: any, j: number) => (
                    <li key={j} className="flex justify-between border-b border-blue-950/5 pb-0.5 lg:pb-1 mb-0.5 lg:mb-1 last:border-0 gap-1">
                      <span className="text-left font-medium min-w-0 break-words">{item.name}</span> <span className="font-bold text-blue-950 text-right whitespace-nowrap">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}

      </div>

    </section>
  );
}