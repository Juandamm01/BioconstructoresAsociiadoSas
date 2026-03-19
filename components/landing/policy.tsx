"use client";

import React, { useRef, useEffect } from "react";
import { ServicesBento } from "@/components/common";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Policy() {
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Animación del título grande
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 0, opacity: 1 },
        {
          y: -200, // se va hacia arriba
          opacity: 0.3, // se desvanece un poco
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    // Animación de entrada del video
    if (videoWrapperRef.current) {
      gsap.from(videoWrapperRef.current, {
        opacity: 0,
        scale: 0.7,
        rotateY: 60,
        duration: 1.8,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.to(videoWrapperRef.current, {
        boxShadow: "0 0 40px rgba(59,130,246,0.6)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(videoWrapperRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // Texto descriptivo con efecto 3D
    gsap.from(".services-text p", {
      opacity: 0,
      y: 60,
      rotateX: 40,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-linear-to-b from-blue-950 to-white z-50 px-6 md:px-20 py-24 md:py-40"
    >
      <div className="container mx-auto">
        {/* Título grande con scroll hacia arriba */}
        <h2
          ref={titleRef}
          className="text-center md:text-[120px] text-6xl uppercase font-extrabold bg-linear-to-b from-white to-blue-400 bg-clip-text text-transparent tracking-tight"
        >
          Políticas ISP
        </h2>

        {/* Texto descriptivo */}
        <div className="services-text flex flex-col md:flex-row items-center gap-10 md:gap-20 mt-10">
          <p className="tracking-normal text-lg text-start text-white/80 max-w-xl font-paragraph">
            BCAS ofrece a todos sus clientes servicios normativos que garantizan
            seguridad digital, responsabilidad social y cumplimiento legal en
            Villavicencio y Colombia.
          </p>
        </div>

        {/* Bento de servicios */}
        <ServicesBento />

        {/* Video con overlay */}
        <div
          ref={videoWrapperRef}
          className="relative w-full h-96 md:h-150 rounded-3xl mt-12 overflow-hidden border-4 border-blue-950 shadow-xl bg-blue-950"
        >
          <video
            src="/videos/conectividad.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-blue-950/70 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}