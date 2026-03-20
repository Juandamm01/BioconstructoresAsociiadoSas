"use client";

import React, { useRef } from "react";
import { Privacy } from "@/components/common";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function Policy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Timeline principal con PIN y SCRUB
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=2500", // Mayor profundidad de scroll para una experiencia más cinemática
        pin: true,
        scrub: 1.5, // Un poco más lento para mayor elegancia
        anticipatePin: 1,
      }
    });

    // 1. ESCENA 1: BIENVENIDA (TÍTULO + TEXTO)
    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.6, filter: "blur(20px)", y: 100 },
      { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, duration: 2, ease: "expo.out" }
    );

    tl.to({}, { duration: 1 }); // Pausa para lectura

    // TRANSICIÓN 1: Salida de Escena 1
    tl.to(textRef.current, {
      y: -300,
      scale: 0.5,
      opacity: 0,
      filter: "blur(20px)",
      duration: 1.5,
      ease: "power2.inOut"
    });

    // 2. ESCENA 2: EL BENTO (OCUPA EL CENTRO)
    tl.set(bentoRef.current, { pointerEvents: "auto" });
    tl.fromTo(bentoRef.current,
      { opacity: 0, scale: 0.8, y: 300, filter: "blur(20px)" },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        filter: "blur(0px)", 
        duration: 2, 
        ease: "power3.out" 
      },
      "-=0.5"
    );

    tl.to({}, { duration: 1 }); // Pausa para ver tarjetas

    // TRANSICIÓN 2: Salida de Escena 2
    tl.to(bentoRef.current, {
      y: -300,
      scale: 0.7,
      opacity: 0,
      filter: "blur(20px)",
      duration: 1.5,
      ease: "power2.inOut",
      pointerEvents: "none"
    });

    // 3. ESCENA 3: EL VIDEO (FINAL)
    tl.fromTo(videoWrapperRef.current,
      { opacity: 0, scale: 0.6, y: 300, borderRadius: "200px" },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        borderRadius: "40px", 
        duration: 2, 
        ease: "power4.out",
        pointerEvents: "auto"
      },
      "-=0.5"
    );

    // Animación de brillo constante para el video
    gsap.to(videoWrapperRef.current, {
      boxShadow: "0 0 50px rgba(59,130,246,0.8)",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // (Animaciones de texto y tarjetas removidas para una carga más limpia)

    // ── ANIMACIÓN CINEMÁTICA PARA EL VIDEO ──
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-b from-blue-950 via-blue-900 to-white z-40 font-poppins overflow-hidden"
    >
      <div className="relative w-full max-w-7xl h-screen flex items-center justify-center">
        
        {/* CONTENEDOR DE ESCENAS (Todo centrado aquí) */}
        <div className="relative w-full flex flex-col items-center justify-center">
          
          {/* TÍTULO Y TEXTO (ESCENA 1) */}
          <div 
            ref={textRef} // Usamos textRef para el conjunto título + texto
            className="flex flex-col items-center justify-center gap-6 md:gap-10 px-6 opacity-0"
          >
            <h2
              ref={titleRef}
              className="text-center md:text-8xl text-5xl uppercase font-black bg-linear-to-b from-white to-blue-400 bg-clip-text text-transparent tracking-tighter"
            >
              Políticas ISP
            </h2>

            <p className="tracking-tight text-xl md:text-3xl text-white font-medium text-center max-w-5xl leading-[1.4] drop-shadow-2xl">
              BCAS ofrece a todos sus clientes servicios normativos que garantizan
              seguridad digital, responsabilidad social y cumplimiento legal en
              <span className="font-bold text-blue-800 ml-2">Villavicencio.</span>
            </p>
          </div>

          {/* BENTO (ESCENA 2) - Estará oculto inicialmente */}
          <div 
            ref={bentoRef} 
            className="absolute inset-0 flex items-center justify-center px-4 md:px-10 opacity-0 pointer-events-none"
          >
            <div className="w-full max-w-6xl">
              <Privacy />
            </div>
          </div>

          {/* VIDEO (ESCENA 3) */}
          <div
            ref={videoWrapperRef}
            className="absolute w-[95%] md:w-[75%] h-72 md:h-130 rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl bg-blue-950 opacity-0 pointer-events-none"
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
      </div>
    </section>
  );
}