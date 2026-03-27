"use client";

import Link from "next/link";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { authClient } from "@/lib/auth-client";

const gifs = [
  "/gifts/Camarita.gif",
  "/gifts/Compu.gif",
  "/gifts/esqueleto.gif",
  "/gifts/HoraDeAventura.gif"
];

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const [currentGif, setCurrentGif] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % gifs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".panel-izq",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(".anim-text",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.4"
    )
    .fromTo(".panel-der",
      { opacity: 0, paddingLeft: 50 },
      { opacity: 1, paddingLeft: 0, duration: 0.8, ease: "power3.out" },
      "-=0.8"
    )
    .fromTo(".logo-anim",
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.6"
    )
    .fromTo(".form-elem",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" },
      "-=0.4"
    );
  }, { scope: pageRef });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor, llena ambos campos.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setErrorMsg("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    // Login exitoso → ir al inicio
    router.push("/");
  };

  return (
    <div className="relative font-[family-name:var(--font-poppins)]" ref={pageRef}>
      {/* Botón flotante para regresar al inicio */}
      <div className="absolute top-6 left-6 z-[9999]">
        <Link href="/" className="block hover:scale-105 transition-transform duration-300 drop-shadow-lg">
          <img
            src="/images/Logo_BCAS_MODO_OSCURO.png"
            alt="Volver al inicio"
            className="h-10 md:h-14 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen pt-16 lg:pt-0">
        {/* Panel izquierdo */}
        <div className="panel-izq w-full lg:w-1/2 bg-blue-950 text-white flex flex-col justify-center items-center py-16 px-8 relative overflow-hidden">
          <div className="z-10 flex flex-col items-center justify-center gap-6 w-full mt-4">
            <div className="anim-text relative w-56 h-56 md:w-80 md:h-80 flex items-center justify-center overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-lg">
              <AnimatePresence>
                <motion.img
                  key={currentGif}
                  src={gifs[currentGif]}
                  alt="animacion interactiva"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] p-4"
                />
              </AnimatePresence>
            </div>
            <div className="text-center space-y-2 mt-4">
              <h2 className="anim-text text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-white drop-shadow-md">
                Bioconstructores Asociados Sas
              </h2>
              <p className="anim-text text-xs md:text-sm text-white uppercase tracking-widest font-light opacity-90">
                Soluciones Innovadoras para un mundo conectado
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/20 mix-blend-overlay"></div>
        </div>

        {/* Panel derecho */}
        <div className="panel-der w-full lg:w-1/2 flex flex-col justify-center items-center py-8 px-4 lg:px-8 bg-white overflow-hidden shadow-inner">
          <div className="w-full max-w-[320px] space-y-3">
            <div className="text-center">
              <img
                src="/images/bcas-logo.png"
                alt="BCAS Logo"
                className="logo-anim w-12 h-12 mx-auto object-contain mb-2 drop-shadow-md"
              />
              <h1 className="form-elem text-xl md:text-2xl font-bold text-blue-950">¡Hola de Nuevo!</h1>
              <p className="form-elem text-xs md:text-sm text-blue-950/80 mt-1">
                ¡Bienvenido! Por favor, inicia sesión.
              </p>
            </div>

            <form className="space-y-3 mt-3" onSubmit={handleLogin}>
              {errorMsg && (
                <div className="form-elem flex items-center gap-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs font-medium">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}
              <div className="form-elem">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-3 py-2 text-sm text-blue-950 border border-blue-950/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white placeholder-blue-950/50"
                />
              </div>
              <div className="form-elem relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 text-sm text-blue-950 border border-blue-950/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white placeholder-blue-950/50 pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-950/60 hover:text-blue-950 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="form-elem w-full py-2 text-sm bg-blue-950 text-white rounded-md hover:bg-blue-900 transition-colors font-semibold shadow-md shadow-blue-950/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}