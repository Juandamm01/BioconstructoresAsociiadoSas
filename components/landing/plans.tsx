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
    { title: "La Nohora y San Luis", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{name: "50MB +1TV", price: "$68K"}, {name: "100MB +2TV", price: "$95K"}, {name: "200MB +2TV", price: "$105K"}] },
    { title: "La Zuria", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{name: "50MB +1TV", price: "$105K"}, {name: "25MB +1TV", price: "$85K"}, {name: "25MB Solo", price: "$75K"}] },
    { title: "Mesetas, El Triángulo, La Sultana, Rondinella, 12 de Octubre", subtitle: "", badge: "$99.000 Susc.", isPremium: true, items: [{name: "50 MB - $68K", price: "+1 TV"}, {name: "100 MB - $95K", price: "+2 TV"}, {name: "200 MB - $105K", price: "+2 TV"}] }
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
      ScrollTrigger.getAll().filter(st => st.trigger === containerRef.current).forEach(st => st.kill());
    };
  }, { scope: containerRef });

  return (
    <section
      id="plans"
      ref={containerRef}
      className="relative min-h-screen z-50 bg-linear-to-b from-blue-950 from-0% to-white to-45% 
      overflow-hidden px-3 md:px-10 pt-12 md:pt-24 flex flex-col items-center justify-center font-poppins"
    >
      {/* Botón rápido Admin */}
      {mounted && session && (
        <Link
          href="/admin/admin-plans"
          className="absolute bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white text-sm font-semibold rounded-full shadow-xl hover:bg-blue-800 hover:scale-105 transition-all duration-200"
        >
          <Settings2 size={16} />
          Editar Planes
        </Link>
      )}

      <div
        ref={gridRef}
        className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-6 auto-rows-[100px] md:auto-rows-[160px] gap-3 md:gap-5 relative z-10"
      >
        {/* ── TARJETA 1 (HERO/LÍDER) ── */}
        <div className="bento-item col-span-2 md:col-span-3 group relative overflow-hidden bg-white/20 backdrop-blur-md border border-blue-100/30 p-2 md:p-5 rounded-[1.3rem] md:rounded-[2rem] shadow-xl flex flex-row items-center gap-3 md:gap-6">
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
        <div className="bento-item col-span-2 md:col-span-3 bg-white/20 backdrop-blur-md border border-blue-100/30 p-2 md:p-5 rounded-[1.3rem] md:rounded-[2rem] shadow-lg flex flex-col justify-center">
          <h3 className="text-xs md:text-lg font-bold text-blue-950 mb-1 md:mb-3 flex items-center gap-2">
            <span className="bg-blue-100/50 text-blue-950 p-1 rounded-md text-[10px] md:text-sm">🕒</span> Horarios de Atención
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 md:gap-x-6 gap-y-1 text-[10px] md:text-sm text-blue-950">
            <div className="flex justify-between border-b border-blue-950/10 pb-1">
              <span className="font-semibold text-blue-950">{schedule.dia1}</span>
              <span>{schedule.hora1}</span>
            </div>
            <div className="flex justify-between border-b border-blue-950/10 pb-1">
              <span className="font-semibold text-blue-950">{schedule.dia2}</span>
              <span>{schedule.hora2}</span>
            </div>
            <div className="flex justify-between text-blue-950 font-semibold sm:col-span-2 pt-1">
              <span>{schedule.dia3}</span>
              <span>{schedule.hora3}</span>
            </div>
          </div>
        </div>

        {/* ── GRUPOS DE PRECIOS DINÁMICOS ── */}
        {groups.map((group, i) => (
          <div key={i} className={`bento-item ${group.isPremium ? 'col-span-2 md:col-span-2 shadow-xl' : 'col-span-1 md:col-span-2 shadow-lg'} bg-white/20 backdrop-blur-md border border-blue-100/30 p-1.5 md:p-4 rounded-[1.3rem] md:rounded-[2rem] text-blue-950 flex flex-col justify-center`}>
            {group.isPremium ? (
              <div className="space-y-1.5 md:space-y-3">
                <h4 className="font-bold text-[9px] md:text-base leading-tight">{group.title}</h4>
                {group.badge && (
                  <p className="inline-block bg-blue-100 text-blue-950 text-[9px] md:text-xs font-bold px-2 py-0.5 rounded-full">
                    {group.badge}
                  </p>
                )}
                <ul className="space-y-0.5 text-[9px] md:text-xs">
                  {group.items.map((item: any, j: number) => (
                    <li key={j} className="flex justify-between">
                      <span>{item.name}</span> <span className="text-blue-950 font-bold">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <h4 className="font-bold text-[9px] md:text-sm leading-tight mb-1 text-blue-950">{group.title}</h4>
                {group.subtitle && <p className="text-blue-950 font-bold mb-1 text-[9px] md:text-xs">{group.subtitle}</p>}
                <ul className="space-y-0.5 text-[9px] md:text-xs text-blue-950">
                  {group.items.map((item: any, j: number) => (
                    <li key={j} className="flex justify-between">
                      <span>{item.name}</span> <span className="font-bold text-blue-950">{item.price}</span>
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