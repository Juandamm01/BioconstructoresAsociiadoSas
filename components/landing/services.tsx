"use client";

import { events } from "@/contants/landing";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Movimiento de títulos
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(title1Ref.current, { xPercent: 20 })
      .to(title2Ref.current, { xPercent: -20 }, "<");

    // Animación tipo pin-scroll
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
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

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      className="upcoming-section bg-linear-to-b from-white to-blue-950 relative w-full h-[140dvh] overflow-hidden z-40 -mt-[60vh]"
    >
      {/* Texto principal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h2 
          ref={title1Ref}
          className="first-title uppercase font-black font-poppins text-[12vw] md:text-[8vw] leading-[100%] tracking-[-.4vw] bg-linear-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent"
        >
          Nuestros
        </h2>
        <h2 
          ref={title2Ref}
          className="sec-title uppercase font-black font-poppins text-[12vw] md:text-[8vw] leading-[100%] tracking-[-.4vw] bg-linear-to-b from-white to-blue-300 text-transparent bg-clip-text"
        >
          Servicios
        </h2>
      </div>

      {/* Cards de Servicios */}
      <div className="pin-box flex items-center justify-center space-x-6 md:space-x-12 absolute inset-0 z-30">
        {events.map((event, index) => (
          <div
            key={index}
            className={`service-card ${event.rotation} w-[25vw] h-[36vw] sm:w-40 sm:h-56 md:w-72 md:h-96 lg:w-80 lg:h-[28rem] flex-none md:rounded-[2vw] rounded-xl overflow-hidden border-[.1vw] shadow-xl relative`}
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
              <div className="absolute bottom-2 md:bottom-5 lg:bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-auto bg-blue-900/90 px-1 sm:px-4 md:px-5 lg:px-6 py-1 md:py-1.5 lg:py-2 rounded-md md:rounded-lg shadow-lg flex items-center justify-center text-center">
                <span className="text-white text-[3vw] sm:text-xs md:text-lg lg:text-xl font-poppins font-bold tracking-tight md:tracking-wide drop-shadow-md leading-tight">
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
