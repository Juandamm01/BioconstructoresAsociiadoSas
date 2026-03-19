"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Phrase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrada inicial con efecto 3D y rebote
    gsap.from(".plans-block", {
      opacity: 0,
      x: -200,
      rotateY: 60,
      scale: 0.7,
      duration: 1.5,
      ease: "elastic.out(1, 0.6)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(".hours-block", {
      opacity: 0,
      x: 200,
      rotateY: -60,
      scale: 0.7,
      duration: 1.5,
      ease: "elastic.out(1, 0.6)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      },
    });

    // Movimiento dinámico al scrollear (parallax opuesto + rotación + scale)
    gsap.to(".plans-block", {
      x: -180,
      rotateY: -20,
      scale: 1.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // suaviza el movimiento
      },
    });

    gsap.to(".hours-block", {
      x: 180,
      rotateY: 20,
      scale: 1.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // suaviza el movimiento
      },
    });

    // Letras que aparecen y desaparecen con scroll (sin slide brusco)
    gsap.utils.toArray(".plans-block li, .hours-block li").forEach((el: any) => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
    });

    // Logo flotante con rotación suave
    gsap.to(".bcas-logo", {
      y: -30,
      rotation: 15,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen z-50 bg-linear-to-b from-blue-950 to-white 
      overflow-hidden px-6 md:px-20 py-24 md:py-36 flex flex-col items-center"
    >
      {/* Logo */}
      <img
        src="/images/bcas-logo.png"
        alt="BCAS Logo"
        className="bcas-logo w-40 md:w-56 mb-12"
      />

      {/* Contenedor en dos columnas */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Planes de Internet */}
        <aside className="plans-block bg-white rounded-2xl p-6 md:p-10 text-blue-950 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Nuestros Planes de Internet
          </h3>
          <div className="space-y-6 text-base md:text-lg">
            <div>
              <p className="font-semibold">
                Cobertura: Mesetas, El Triángulo, La Sultana, La Azotea, Rondinella, 12 de Octubre
              </p>
              <p>Suscripción: $99.000*</p>
              <ul className="list-disc list-inside">
                <li>Plan 50 MB — $68.000 — 1 Punto de TV GRATIS</li>
                <li>Plan 100 MB — $95.000 — 2 Puntos de TV GRATIS</li>
                <li>Plan 200 MB — $105.000 — 2 Puntos de TV GRATIS</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Cobertura: La Nohora y San Luis de Ocoa Bajo</p>
              <p>Suscripción: $89.000*</p>
              <ul className="list-disc list-inside">
                <li>Plan 50 MB — $68.000 — 1 Punto de TV GRATIS</li>
                <li>Plan 100 MB — $95.000 — 2 Puntos de TV GRATIS</li>
                <li>Plan 200 MB — $105.000 — 2 Puntos de TV GRATIS</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Cobertura: La Zuria</p>
              <p>Suscripción: $89.000*</p>
              <ul className="list-disc list-inside">
                <li>50 Megas + 1 Punto de TV — $105.000</li>
                <li>25 Megas + 1 Punto de TV — $85.000</li>
                <li>25 Megas solo Internet — $75.000</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Horarios de Atención */}
        <aside className="hours-block bg-blue-950 rounded-2xl p-6 md:p-10 text-white shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Horarios de Atención
          </h3>
          <ul className="space-y-2 text-base md:text-lg">
            <li><strong>Lunes:</strong> 8:00 AM - 12:00 PM / 2:00 PM - 5:00 PM</li>
            <li><strong>Martes:</strong> 8:00 AM - 12:00 PM / 2:00 PM - 5:00 PM</li>
            <li><strong>Miércoles:</strong> 8:00 AM - 12:00 PM / 2:00 PM - 5:00 PM</li>
            <li><strong>Jueves:</strong> 8:00 AM - 12:00 PM / 2:00 PM - 5:00 PM</li>
            <li><strong>Viernes:</strong> 8:00 AM - 12:00 PM / 2:00 PM - 5:00 PM</li>
            <li><strong>Sábado:</strong> 8:00 AM - 1:00 PM</li>
            <li><strong>Domingo:</strong> Cerrado</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}