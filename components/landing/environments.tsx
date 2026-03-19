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

    const scrollAmount = slider.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollAmount + 1000}px`,
        scrub: true,
        pin: true,
      },
    });

    tl.to(slider, {
      x: `-${scrollAmount}px`,
      ease: "power1.inOut",
    });
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
      // Fondo degradado azul oscuro con transparencia
      className="flavor-section min-h-dvh bg-linear-to-b from-blue-900/80 via-blue-700/30 to-white relative z-50 overflow-hidden"
    >
      <div
        ref={sliderRef}
        className="h-dvh flex lg:flex-row flex-col items-center relative"
      >
        {/* Columna del título */}
        <div className="lg:w-[57%] flex-none h-80 lg:h-full md:mt-20 xl:mt-0">
          <Title />
        </div>

        {/* Scroll horizontal */}
        <div className="flex space-x-32 h-full mt-20 lg:mt-40 pr-64">
          {environments.map((env, index) => (
            <EnvironmentCard
              key={index} // usamos el índice como key
              image={env.image} // solo pasamos la imagen
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
    <div className="flex flex-col justify-center items-center md:text-7xl text-5xl uppercase leading-[6vw] tracking-[-.25vw] font-light h-full">
      {/* Título principal */}
      <div className="leading-none md:text-center overflow-hidden 2xl:py-0">
        <h2 className="text-white drop-shadow-lg">Nosotros</h2>
      </div>

      {/* Texto */}
      <div>
        <p className="mt-10 tracking-normal text-xl md:text-3xl text-center text-white max-w-5xl mx-auto font-paragraph leading-relaxed drop-shadow-md">
          Somos un proveedor de servicios de Internet (ISP) comprometido con
          ofrecer conectividad estable, segura y de alta calidad. Nuestra misión
          es garantizar que hogares y empresas cuenten con un servicio confiable,
          soporte técnico oportuno y soluciones adaptadas a sus necesidades.
          <br /><br />
          Nuestra infraestructura y enfoque tecnológico nos permiten brindar un
          servicio eficiente, con cobertura estratégica y atención personalizada.
          Conectamos personas, impulsamos negocios y acercamos oportunidades,
          fortaleciendo la transformación digital en Villavicencio y la región.
          <br /><br />
          {/* Dirección con enlace */}
          <a
            href="https://www.google.com/maps/dir//BCAS+SAS,+Cra.+59+%2340-28+L1,+Villavicencio,+Meta/@4.152445,-73.658558,303m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x8e3e339afdcf6ca1:0x523227370f35ad2b!2m2!1d-73.6577371!2d4.1521025?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 underline hover:text-blue-200 transition-colors"
          >
           BCAS SAS, Cra. 59 #40-28 L1, Villavicencio, Meta
          </a>
        </p>
      </div>
    </div>
  );
}