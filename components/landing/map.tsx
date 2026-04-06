"use client";

import { GoogleMap, Circle, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Settings2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const center = { lat: 4.142868, lng: -73.650565 };

export function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  });

  const [barrios, setBarrios] = useState<any[]>([]);
  const [hoverBarrio, setHoverBarrio] = useState<any>(null);
  const { data: session } = authClient.useSession();

  const sectionRef = useRef<HTMLDivElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Si llegan a la página pública interactuando etc, cerramos sesión por seguridad
    authClient.signOut();
    
    fetch("/api/barrios", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        console.log("Barrios desde API:", data);
        setBarrios(data);
      });
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=500",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      }
    });

    tl.fromTo(".map-title",
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, ease: "power2.out" }
    );

    tl.fromTo(mapBoxRef.current,
      { opacity: 0, y: 100, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: "power2.out" },
      "-=0.4"
    );

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
      ScrollTrigger.getAll().filter(st => st.trigger === sectionRef.current).forEach(st => st.kill());
    };
  }, { scope: sectionRef });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center min-h-screen font-poppins px-3 md:px-12 pt-16 md:pt-32 pb-20 md:pb-16 gap-3 md:gap-6 bg-linear-to-b from-white via-white to-blue-950"
    >

      <div className="relative w-[95%] max-w-[300px] md:max-w-4xl flex flex-col gap-3 md:gap-4">
        
        <h2 className="map-title text-center text-base md:text-4xl font-black uppercase tracking-tight bg-gradient-to-b from-blue-950 via-blue-900 to-white/0 bg-clip-text text-transparent opacity-0">
          Sectores donde estamos presentes
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] gap-2 md:gap-10 items-start">

          {/* MAPA */}
          <div
            ref={mapBoxRef}
            className="relative w-full h-[160px] md:h-[260px] rounded-xl md:rounded-[1.5rem] overflow-hidden shadow-2xl border border-blue-100 bg-white"
          >
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={13}
              >
                {barrios.map((barrio, i) => (
                  <Circle
                    key={i}
                    center={{ lat: Number(barrio.lat), lng: Number(barrio.lng) }}
                    radius={Number(barrio.radio)}
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
                  <InfoWindow position={{ lat: Number(hoverBarrio.lat), lng: Number(hoverBarrio.lng) }}>
                    <div style={{
                      backgroundColor: "#030816",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      fontWeight: "bold",
                    }}>
                      {hoverBarrio.nombre}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-950/20 border-t-blue-950 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* LISTADO */}
          <aside
            ref={asideRef}
            className="w-full bg-white/60 backdrop-blur rounded-lg md:rounded-[1.5rem] p-3 md:p-5 shadow-xl border border-blue-50"
          >
            <h3 className="text-[11px] md:text-base font-bold mb-2 md:mb-3 text-blue-950 font-[family-name:var(--font-poppins)]">Listado de Barrios</h3>

            <ul className="flex flex-col gap-1 md:gap-1.5 max-h-[120px] md:max-h-[200px] overflow-y-auto pr-2">
              {barrios.map((barrio, i) => (
                <li key={i} className="map-list-item flex items-center gap-1.5 md:gap-2">
                  <span
                    className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: barrio.color }}
                  />
                  <span className="text-gray-900 text-[10px] md:text-sm font-medium font-[family-name:var(--font-poppins)] leading-tight">{barrio.nombre}</span>
                </li>
              ))}
            </ul>
          </aside>

        </div>
      </div>
    </section>
  );
}