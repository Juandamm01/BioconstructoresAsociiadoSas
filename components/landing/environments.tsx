"use client";

import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import { EnvironmentCard } from "@/components/common";

gsap.registerPlugin(ScrollTrigger);

export function Environments() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const slider = sliderRef.current;
    if (!section || !slider) return;

    // Solo en desktop activamos el scroll horizontal con pin
    if (window.innerWidth >= 1024) {
      const scrollAmount = slider.scrollWidth - window.innerWidth;

      gsap.to(slider, {
        x: `-${scrollAmount}px`,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollAmount + 800}px`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  });

  const environments = [
    { image: "/images/bcas1.jpg" },
    { image: "/images/bcas2.jpg" },
    { image: "/images/bcas3.jpg" },
    { image: "/images/bcas4.jpg" },
  ];

  return (
    <section
      ref={sectionRef}
      className="flavor-section min-h-screen bg-linear-to-b from-blue-900/80 via-blue-700/30 to-white relative z-50 overflow-hidden"
    >
      <div
        ref={sliderRef}
        className="flex lg:flex-row flex-col items-center relative lg:h-[100dvh] lg:min-h-0 min-h-[120vh]"
      >
        {/* ── Columna del título ── */}
        <div className="lg:w-[50%] w-full flex-none lg:h-full pt-28 pb-16 lg:pt-24 lg:pb-12">
          <Title />
        </div>

        {/* ── Tarjetas ─────────────────────────────────────────────────────────
            Desktop: fila horizontal (GSAP mueve el slider)
            Móvil:   columna vertical, sin animación, siempre visibles           */}
        <div className="flex lg:flex-row flex-col lg:space-x-20 lg:space-y-0 space-y-12 lg:h-full h-auto mt-4 lg:mt-40 lg:pr-64 px-4 lg:px-0 pb-16 lg:pb-0">
          {environments.map((env, index) => (
            <EnvironmentCard
              key={index}
              image={env.image}
              rotation={
                index % 2 === 0 ? "md:rotate-[-5deg]" : "md:rotate-[5deg]"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Title() {
  return (
    <div className="font-poppins flex flex-col justify-center items-center h-full px-8 lg:px-20 text-center">
      {/* Título */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold uppercase leading-tight tracking-tight text-white drop-shadow-lg">
        Nosotros
      </h2>

      {/* Descripción */}
      <div className="mt-6 text-sm sm:text-base md:text-base lg:text-base xl:text-lg font-light text-white max-w-2xl leading-normal drop-shadow-md space-y-4">
        <p>
          Somos un proveedor de servicios de Internet (ISP) comprometido con
          ofrecer conectividad estable, segura y de alta calidad. Nuestra misión
          es garantizar que hogares y empresas cuenten con un servicio confiable,
          soporte técnico oportuno y soluciones adaptadas a sus necesidades.
        </p>
        <p>
          Nuestra infraestructura y enfoque tecnológico nos permiten brindar un
          servicio eficiente, con cobertura estratégica y atención personalizada.
          Conectamos personas, impulsamos negocios y acercamos oportunidades,
          fortaleciendo la transformación digital en Villavicencio y la región.
        </p>
        <p className="pt-2">
          {/* Dirección */}
          <a
            href="https://www.google.com/maps/dir//BCAS+SAS,+Cra.+59+%2340-28+L1,+Villavicencio,+Meta/@4.152445,-73.658558,303m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x8e3e339afdcf6ca1:0x523227370f35ad2b!2m2!1d-73.6577371!2d4.1521025?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-900 font-medium underline underline-offset-4 hover:text-white transition-colors duration-300"
          >
            BCAS SAS, Cra. 59 #40-28 L1, Villavicencio, Meta
          </a>
        </p>
      </div>
    </div>
  );
}