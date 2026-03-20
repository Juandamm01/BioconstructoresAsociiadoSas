"use client";

import { GoogleMap, LoadScript, Circle, InfoWindow } from "@react-google-maps/api";
import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const center = { lat: 4.142868, lng: -73.650565 };

const barrios = [
  { nombre: "La Azotea", coords: { lat: 4.142868, lng: -73.650565 }, color: "#DC2626", radio: 300 },
  { nombre: "Mesetas Bajas", coords: { lat: 4.145460, lng: -73.655689 }, color: "#2563EB", radio: 350 },
  { nombre: "Mesetas - La Sultana - El Triángulo - San Francisco - Mesetas Alto", coords: { lat: 4.151987, lng: -73.657689 }, color: "#F59E0B", radio: 400 },
  { nombre: "Rondinella", coords: { lat: 4.156844, lng: -73.660360 }, color: "#10B981", radio: 300 },
  { nombre: "Galán", coords: { lat: 4.155597, lng: -73.657949 }, color: "#9333EA", radio: 250 },
  { nombre: "La Nohora", coords: { lat: 4.079677, lng: -73.696592 }, color: "#14B8A6", radio: 450 },
  { nombre: "San Luis de Ocoa Bajo", coords: { lat: 4.078900, lng: -73.704115 }, color: "#F43F5E", radio: 400 },
  { nombre: "Quintas de la Suria", coords: { lat: 4.082271, lng: -73.640960 }, color: "#64748B", radio: 350 },
];

export function Map() {
  const [hoverBarrio, setHoverBarrio] = useState<null | typeof barrios[0]>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Timeline principal con PIN y SCRUB
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=500", // Más corto para que la transición sea más rápida
        pin: true,
        scrub: 0.6, // Valor más bajo para que sea más reactivo al scroll
        anticipatePin: 1,
      }
    });

    // 1. Revelar Título (Escala y Opacidad)
    tl.fromTo(".map-title", 
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, ease: "power2.out" }
    );

    // 2. Revelar Mapa (Subida suave)
    tl.fromTo(mapBoxRef.current,
      { opacity: 0, y: 100, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: "power2.out" },
      "-=0.4" // Solape ligero con el título
    );

    // 3. Revelar Listado (Desplazamiento lateral desde la derecha)
    tl.fromTo(asideRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, ease: "power2.out" },
      "-=0.3"
    );

    tl.from(".map-list-item",
      { opacity: 0, x: -30, stagger: 0.05, ease: "power2.out" },
      "-=0.2"
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="
        relative
        flex flex-col items-center justify-center
        min-h-screen font-poppins
        px-6 md:px-12 pt-28 md:pt-32 pb-20 gap-6 md:gap-6
        bg-linear-to-b from-white via-white to-blue-950
      "
    >
      <div className="relative w-full max-w-6xl flex flex-col gap-6">
        {/* TÍTULO CON GSAP */}
        <h2
          className="
            map-title text-center text-3xl md:text-5xl font-poppins font-black uppercase tracking-tight 
            bg-linear-to-b from-blue-950 via-blue-900 to-white/0 bg-clip-text text-transparent opacity-0
          "
        >
          Sectores donde estamos presentes
        </h2>

        {/* CONTENEDOR GRID: Mapa + Listado Lado a Lado */}
        <div className="flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] gap-6 md:gap-10 items-start">

          {/* MAPA EN CAJA */}
          <div
            ref={mapBoxRef}
            className="
              relative w-full h-[250px] md:h-[280px]
              rounded-[2rem] overflow-hidden
              shadow-2xl
              border border-blue-100
              bg-white
            "
          >
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={13}
            >
              {barrios.map((barrio, i) => (
                <Circle
                  key={i}
                  center={barrio.coords}
                  radius={barrio.radio}
                  options={{
                    strokeColor: barrio.color,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: barrio.color,
                    fillOpacity: 0.35,
                  }}
                  onMouseOver={() => setHoverBarrio(barrio)}
                  onMouseOut={() => setHoverBarrio(null)}
                />
              ))}

              {hoverBarrio && (
                <InfoWindow position={hoverBarrio.coords}>
                  <div
                    style={{
                      backgroundColor: "#030816", // Azul ultra oscuro tipo iPhone Dark
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontSize: "13px",
                      padding: "10px 16px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}
                  >
                    {hoverBarrio.nombre}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

          {/* LISTADO TIPO GLASS IPHONE */}
          <aside
            ref={asideRef}
            className="
              w-full h-full
              bg-white/60 backdrop-blur-[20px]
              border border-white/40
              rounded-[2.5rem]
              p-6 md:p-8
              text-blue-900
              shadow-2xl
              flex flex-col
              ring-1 ring-white/10
            "
          >
            <h3 className="text-xl font-bold mb-4">
              Listado de Barrios
            </h3>

            <ul className="flex flex-col gap-1.5 md:gap-2">
            {barrios.map((barrio, i) => (
              <li
                key={i}
                className="map-list-item flex items-center gap-3 cursor-pointer"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-blue-900/10"
                  style={{ backgroundColor: barrio.color }}
                />
                <span className="font-medium text-xs md:text-sm text-blue-900/90">
                  {barrio.nombre}
                </span>
              </li>
            ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}