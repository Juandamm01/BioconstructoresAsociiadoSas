import { Separator } from "@/components/ui/separator";

export function Hero() {
  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center justify-center text-center">
      {/* Fondo fijo con video */}
      <video
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* Contenido */}
      <div className="relative z-10 text-white max-w-3xl px-4">
        <h1 className="text-5xl md:text-7xl font-poppins font-black tracking-tight mb-4">
          Bienvenido a <br />
          <span className="text-white/90">Bioconstructores Asociados Sas</span>
        </h1>

        <Separator className="bg-white/40 my-4 max-w-lg mx-auto" />

        <p className="text-lg md:text-xl text-white/80 font-light">
          Soluciones Innovadoras Para Un Mundo Conectado.
        </p>
      </div>
    </section>
  );
}