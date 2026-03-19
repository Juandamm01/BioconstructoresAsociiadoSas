"use client";

import React, { useRef } from "react";
import { ServicesBento } from "@/components/common";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function Policy() {
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
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

    // (Animaciones de texto y tarjetas removidas para una carga más limpia)

    // ── ANIMACIÓN CINEMÁTICA PARA EL VIDEO ──
    if (videoWrapperRef.current) {
      gsap.fromTo(
        videoWrapperRef.current,
        {
          scale: 0.85,
          opacity: 0,
          borderRadius: "100px",
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          borderRadius: "24px", // Vuelve a rounded-3xl nativo
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: videoWrapperRef.current,
            start: "top 95%",
            end: "top 50%", // La animación ocurre mientras haces este trayecto de scroll
            scrub: 1.2, // El usuario controla la "expansión" cinemática del video
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  });

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

        {/* Texto descriptivo (Centrado perfectamente vertical y horizontalmente) */}
        <div className="services-text flex flex-col items-center justify-center min-h-[40vh] md:min-h-[50vh] text-center w-full mt-4 md:mt-8 px-4">
          <p className="tracking-wide text-lg md:text-2xl text-white/90 max-w-4xl font-paragraph leading-relaxed drop-shadow-sm">
            BCAS ofrece a todos sus clientes servicios normativos que garantizan
            seguridad digital, responsabilidad social y cumplimiento legal en
            <span className="font-bold text-blue-300"> Villavicencio y Colombia.</span>
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