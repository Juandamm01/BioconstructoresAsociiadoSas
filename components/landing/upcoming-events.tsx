"use client";

import { events } from "@/contants/landing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function UpcomingEvents() {
  useGSAP(() => {
    gsap.set(".upcoming-section", { marginTop: "-80vh" });

    // Movimiento de títulos
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".upcoming-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(".upcoming-section .first-title", { xPercent: 20 })
      .to(".upcoming-section .sec-title", { xPercent: -20 }, "<");

    // Animación tipo pin-scroll
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".upcoming-section",
        start: "10% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    pinTl.from(".service-card", {
      yPercent: 150,
      stagger: 0.25,
      ease: "power2.inOut",
      opacity: 0,
    });
  });

  return (
    <section className="upcoming-section bg-linear-to-b from-white to-blue-950 relative w-full h-[120dvh] overflow-hidden z-40">
      {/* Texto principal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h2 className="first-title uppercase font-bold text-[12vw] leading-[100%] tracking-[-.4vw] bg-linear-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
          Nuestros
        </h2>
        <h2 className="sec-title uppercase font-bold text-[12vw] leading-[100%] tracking-[-.4vw] bg-linear-to-b from-white to-blue-300 text-transparent bg-clip-text">
          Servicios
        </h2>
      </div>

      {/* Cards de Servicios */}
      <div className="pin-box flex items-center justify-center -space-x-10 absolute inset-0 z-30">
        {events.map((event, index) => (
          <div
            key={index}
            className={`service-card ${event.rotation} md:w-96 w-80 h-135 flex-none md:rounded-[2vw] rounded-3xl overflow-hidden border-[.1vw] shadow-xl relative`}
          >
            <div className="relative w-full h-full">
              <Image
                src={event.src}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
              {/* Subtítulo más notorio */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-900/90 px-6 py-2 rounded-lg shadow-lg">
                <span className="text-white text-lg md:text-2xl font-bold tracking-wide drop-shadow-md">
                  {event.subtitle}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}