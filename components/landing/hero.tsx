import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export async function Hero() {
  const session = await auth.api.getSession({ headers: await headers() });
  const config = await prisma.heroConfig.findUnique({ where: { id: 1 } });
  
  const videoUrl = config?.videoUrl || "/videos/hero1.mp4";
  const bienvenido = config?.bienvenido || "Bienvenido a";
  const empresa = config?.empresa || "Bioconstructores Asociados Sas";
  const slogan = config?.slogan || "Soluciones Innovadoras Para Un Mundo Conectado.";

  return (
    <section id="home" className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center justify-center text-center">
      {/* Botón rápido para acceder al editor si es admin */}
      {session && (
        <Link
          href="/admin/admin-hero"
          className="absolute bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-blue-950/80 text-white text-xs font-bold rounded-full backdrop-blur hover:bg-blue-900 shadow-xl transition-all border border-white/20"
        >
          <Edit2 size={12} />
          Editar Hero
        </Link>
      )}

      {/* Fondo fijo con video */}
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* Contenido */}
      <div className="relative z-10 text-white max-w-3xl px-4">
        <h1 className="text-5xl md:text-7xl font-poppins font-black tracking-tight mb-4 drop-shadow-lg">
          {bienvenido} <br />
          <span className="text-white/90">{empresa}</span>
        </h1>

        <Separator className="bg-white/40 my-4 max-w-lg mx-auto shadow-sm" />

        <p className="text-lg md:text-xl text-white/80 font-light drop-shadow-md">
          {slogan}
        </p>
      </div>
    </section>
  );
}