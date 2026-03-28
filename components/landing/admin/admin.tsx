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
      { opacity: 0, x: -100, filter: "blur(10px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power4.out" }
    )
    .fromTo(".panel-der",
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: "power4.out" },
      "-=0.8"
    )
    .fromTo(".anim-text",
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" },
      "-=0.6"
    )
    .fromTo(".logo-anim",
      { scale: 0, rotation: -360, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
      "-=0.6"
    )
    .fromTo(".form-elem",
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.4"
    );

    // Animación continua y sutil de respiración para el contenedor del GIF
    gsap.to(".gif-container", {
      y: -15,
      rotation: 2,
      scale: 1.02,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
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

    router.push("/");
  };

  return (
    <div className="relative font-poppins w-full h-[100dvh] overflow-hidden bg-white" ref={pageRef}>
      {/* Botón flotante */}
      <motion.div 
        className="absolute top-4 left-4 lg:top-6 lg:left-6 z-[9999]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Link href="/" className="block hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          <img
            src="/images/Logo_BCAS_MODO_OSCURO.png"
            alt="Volver al inicio"
            className="h-8 md:h-12 w-auto object-contain"
          />
        </Link>
      </motion.div>

      <div className="flex flex-col lg:flex-row w-full h-full">
        
        {/* Panel Izquierdo Animado */}
        <div className="panel-izq w-full lg:w-1/2 h-[40%] lg:h-full relative flex flex-col justify-center items-center px-4 py-2 lg:p-8 overflow-hidden bg-[#0a1024]">
          {/* Fondo dinámico y esferas de luz */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#0a1024] to-black opacity-80" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-40 h-40 md:w-96 md:h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] md:blur-[100px] opacity-30" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] opacity-20" 
          />

          <div className="z-10 flex flex-col items-center justify-center gap-2 md:gap-6 w-full h-full justify-evenly lg:justify-center">
            <div className="gif-container anim-text relative w-28 h-28 md:w-80 md:h-80 flex items-center justify-center overflow-hidden rounded-[1.2rem] md:rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(37,99,235,0.15)] backdrop-blur-sm">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={currentGif}
                  src={gifs[currentGif]}
                  alt="animacion interactiva"
                  initial={{ scale: 0.5, rotate: -15, opacity: 0, filter: "blur(10px)" }}
                  animate={{ scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ scale: 1.5, rotate: 15, opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] p-2 md:p-4"
                />
              </AnimatePresence>
            </div>
            
            <div className="text-center space-y-1 md:space-y-3">
              <h2 className="anim-text text-xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-lg leading-none">
                Bioconstructores <br className="hidden md:block"/> Asociados
              </h2>
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                className="anim-text text-[9px] md:text-sm text-cyan-200 uppercase tracking-[0.2em] md:tracking-[0.3em] font-medium"
              >
                Soluciones Innovadoras
              </motion.p>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-blue-950/20 mix-blend-overlay pointer-events-none border-r border-white/5 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Panel Derecho */}
        <div className="panel-der w-full lg:w-1/2 h-[60%] lg:h-full flex flex-col justify-center items-center p-4 lg:p-12 bg-white overflow-hidden shadow-2xl relative">
          
          {/* Adorno sutil fondo derecho */}
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-blue-50 rounded-full blur-[60px] md:blur-[80px] -z-10 opacity-70"></div>
          
          <div className="w-full max-w-[280px] md:max-w-[340px] flex flex-col justify-evenly h-full md:justify-center md:space-y-6 relative z-10 py-2">
            <div className="text-center">
              <motion.img
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                src="/images/bcas-logo.png"
                alt="BCAS Logo"
                className="logo-anim w-12 h-12 md:w-16 md:h-16 mx-auto object-contain mb-2 md:mb-4 drop-shadow-lg cursor-pointer"
              />
              <h1 className="form-elem text-xl md:text-3xl font-black text-blue-950 tracking-tight leading-tight">¡Hola de Nuevo!</h1>
              <p className="form-elem text-[11px] md:text-sm text-slate-500 mt-1 font-medium">
                Accede a tu panel de administración.
              </p>
            </div>

            <form className="space-y-3 md:space-y-4" onSubmit={handleLogin}>
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="form-elem flex items-center justify-center gap-1 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[10px] md:text-xs font-bold shadow-sm"
                  >
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="form-elem relative group">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-sm text-blue-950 border-2 border-slate-100 rounded-[0.8rem] md:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 hover:bg-slate-50 transition-all font-medium placeholder-slate-400"
                />
              </div>
              
              <div className="form-elem relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-sm text-blue-950 border-2 border-slate-100 rounded-[0.8rem] md:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 hover:bg-slate-50 transition-all pr-10 md:pr-12 font-medium placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} className="md:w-[18px] md:h-[18px]"/> : <Eye size={16} className="md:w-[18px] md:h-[18px]"/>}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                type="submit"
                className="form-elem group w-full py-2.5 md:py-3.5 mt-2 md:mt-4 text-xs md:text-sm bg-linear-to-r from-blue-950 to-blue-800 text-white rounded-[0.8rem] md:rounded-xl transition-all font-bold shadow-lg shadow-blue-950/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Iniciando...
                    </>
                  ) : "Entrar al Sistema"}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent z-0" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}