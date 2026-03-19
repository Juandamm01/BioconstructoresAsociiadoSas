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
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animación del título
    gsap.fromTo(".map-title", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".map-title",
          start: "top 90%",
          once: true
        }
      }
    );

    // Animación de la lista de barrios
    gsap.fromTo(".map-list-item", 
      { opacity: 0, x: -20 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".map-list-item",
          start: "top 95%",
          once: true
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
    <section
      className="
        relative
        flex flex-col items-center justify-center
        min-h-screen
        px-6 md:px-20 py-24 md:py-36 gap-12
        bg-linear-to-b from-white to-blue-950 to-40%
      "
    >
      <div className="relative w-full max-w-7xl">

        {/* TÍTULO CON GSAP */}
        <h2
          className="
            map-title text-center text-4xl md:text-7xl font-nighty tracking-wide mb-12
            bg-linear-to-b from-blue-950 to-blue-700 bg-clip-text text-transparent opacity-0
          "
        >
          Sectores donde estamos presentes
        </h2>

        {/* MAPA EN CAJA */}
        <div
          className="
            relative w-full h-125 md:h-150
            rounded-2xl overflow-hidden
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
          className="
            mt-12 w-full
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-[2.5rem]
            p-8 md:p-12
            text-white
            shadow-2xl
          "
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Listado de Barrios
          </h3>

          <ul className="grid md:grid-cols-2 gap-4">
            {barrios.map((barrio, i) => (
              <li
                key={i}
                className="map-list-item flex items-center gap-3 cursor-pointer opacity-0"
              >
                <span
                  className="w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: barrio.color }}
                />
                <span className="font-medium text-sm md:text-base">
                  {barrio.nombre}
                </span>
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </section>
    </div>
  );
}