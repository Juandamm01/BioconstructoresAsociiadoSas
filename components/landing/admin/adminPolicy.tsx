"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Upload, AlertCircle, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import { AdminSidebar } from "./AdminSidebar";

export default function AdminPolicyDashboard({ initialConfig }: { initialConfig: any }) {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [config, setConfig] = useState({
    titulo: initialConfig?.titulo || "Políticas ISP",
    texto: initialConfig?.texto || "BCAS ofrece a todos sus clientes servicios normativos que garantizan seguridad digital, responsabilidad social y cumplimiento legal en",
    resaltado: initialConfig?.resaltado || "Villavicencio.",
    videoUrl: initialConfig?.videoUrl || "/videos/conectividad.mp4",
    b1Titulo: initialConfig?.b1Titulo || "Internet Sano",
    b1Texto: initialConfig?.b1Texto || "Nos unimos a la campaña del Ministerio TIC para promover el uso seguro de Internet, generando conciencia sobre la prevención de la explotación infantil en entornos digitales.",
    b2Titulo: initialConfig?.b2Titulo || "Ley 679 de 2001",
    b2Texto: initialConfig?.b2Texto || "Adoptamos medidas técnicas y administrativas para prevenir la difusión de contenido ilegal relacionado con menores de edad, implementando controles y filtros.",
    b3Titulo: initialConfig?.b3Titulo || "Ley 1336 de 2009",
    b3Texto: initialConfig?.b3Texto || "Fortalecemos la protección de menores mediante códigos de conducta y políticas de prevención en servicios digitales para evitar la explotación sexual infantil.",
    b4Titulo: initialConfig?.b4Titulo || "Protección de Datos",
    b4Texto: initialConfig?.b4Texto || "Garantizamos la confidencialidad de la información personal, aplicamos medidas de protección para prevenir fraude y accesos no autorizados."
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewVideo, setPreviewVideo] = useState(config.videoUrl);

  useGSAP(() => {
    gsap.fromTo(".anim-card", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
    );
  }, { scope: pageRef });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    let finalVideoUrl = config.videoUrl;

    try {
      const resp = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, videoUrl: finalVideoUrl })
      });
      if (resp.ok) {
        setSuccessMsg("¡Políticas actualizadas correctamente!");
        router.refresh();
      } else {
        setErrorMsg("No se pudieron guardar los cambios");
      }
    } catch (e) {
      setErrorMsg("Error general");
    }
    setLoading(false);
  };

  return (
    <div ref={pageRef} className="flex min-h-screen bg-slate-50 font-poppins text-blue-950">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden pb-12">
        <header className="bg-white text-blue-950 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-10 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-lg leading-none">Editor de Políticas ISP</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm anim-card">
            <h2 className="text-xl font-bold text-blue-950 mb-4">Textos Principales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Título</label>
                <input 
                  type="text" 
                  value={config.titulo} 
                  onChange={e => setConfig({...config, titulo: e.target.value})} 
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none text-sm text-slate-900 bg-white transition-colors" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Párrafo Descriptivo</label>
                <textarea 
                  rows={4}
                  value={config.texto} 
                  onChange={e => setConfig({...config, texto: e.target.value})} 
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none text-sm text-slate-900 bg-white transition-colors resize-none" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Palabra Resaltada</label>
                <input 
                  type="text" 
                  value={config.resaltado} 
                  onChange={e => setConfig({...config, resaltado: e.target.value})} 
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none text-sm text-slate-900 bg-white transition-colors" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm anim-card">
            <h2 className="text-xl font-bold text-blue-950 mb-4">Textos de Tarjetas de Privacidad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Tarjeta 1</label>
                  <input value={config.b1Titulo} onChange={e => setConfig({...config, b1Titulo: e.target.value})} className="w-full font-bold text-blue-950 mb-2 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-blue-500"/>
                  <textarea rows={4} value={config.b1Texto} onChange={e => setConfig({...config, b1Texto: e.target.value})} className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 resize-none focus:outline-none focus:border-blue-500" />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Tarjeta 3</label>
                  <input value={config.b3Titulo} onChange={e => setConfig({...config, b3Titulo: e.target.value})} className="w-full font-bold text-blue-950 mb-2 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-blue-500"/>
                  <textarea rows={4} value={config.b3Texto} onChange={e => setConfig({...config, b3Texto: e.target.value})} className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 resize-none focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Tarjeta 2</label>
                  <input value={config.b2Titulo} onChange={e => setConfig({...config, b2Titulo: e.target.value})} className="w-full font-bold text-blue-950 mb-2 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-blue-500"/>
                  <textarea rows={4} value={config.b2Texto} onChange={e => setConfig({...config, b2Texto: e.target.value})} className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 resize-none focus:outline-none focus:border-blue-500" />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Tarjeta 4</label>
                  <input value={config.b4Titulo} onChange={e => setConfig({...config, b4Titulo: e.target.value})} className="w-full font-bold text-blue-950 mb-2 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-blue-500"/>
                  <textarea rows={4} value={config.b4Texto} onChange={e => setConfig({...config, b4Texto: e.target.value})} className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 resize-none focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm anim-card">
            <h2 className="text-xl font-bold text-blue-950 mb-4">Fondo / Video de Conectividad</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-blue-900 block">URL del fondo (Video o Imagen)</label>
                <input 
                  type="url" 
                  value={config.videoUrl || ""}
                  onChange={(e) => {
                    setConfig({...config, videoUrl: e.target.value});
                    setPreviewVideo(e.target.value);
                  }}
                  placeholder="https://ejemplo.com/video.mp4 o imagen.jpg"
                  className="w-full border-2 border-blue-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none text-sm text-slate-900 bg-white transition-colors" 
                />
                <span className="text-[10px] text-slate-500">Puedes poner una URL de un video (.mp4) o una imagen (.jpg, .png).</span>
              </div>

              {previewVideo && (
                <div className="relative w-full h-40 bg-slate-900 rounded-xl overflow-hidden mt-2">
                  {previewVideo?.endsWith(".mp4") || previewVideo?.endsWith(".webm") ? (
                    <video src={previewVideo} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <img src={previewVideo} className="w-full h-full object-cover opacity-80" alt="Preview"/>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-3 py-1 bg-black/60 rounded-lg text-white text-xs font-bold backdrop-blur-sm">Vista previa de Video</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* -- Previsualización en Vivo -- */}
        <div className="bg-blue-950 rounded-3xl border border-blue-900 shadow-xl overflow-hidden anim-card p-6 md:p-10 flex flex-col items-center justify-center relative min-h-[600px]">
          <div className="absolute top-4 left-4 flex gap-1 z-10">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="text-center z-10 space-y-6 max-w-lg mt-8">
            <span className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-[10px] font-bold tracking-widest uppercase border border-white/20 backdrop-blur-sm">
              Live Preview
            </span>
            <h2 className="text-4xl lg:text-5xl uppercase font-black bg-linear-to-b from-white to-blue-400 bg-clip-text text-transparent tracking-tighter">
              {config.titulo || "Título"}
            </h2>
            <p className="text-white/90 font-medium text-center text-sm md:text-base leading-relaxed">
              {config.texto}{" "}
              <span className="font-bold text-blue-400">{config.resaltado}</span>
            </p>
          </div>

          <div className="w-[90%] md:w-[85%] mt-10 rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl relative">
            {previewVideo?.endsWith(".mp4") || previewVideo?.endsWith(".webm") ? (
              <video src={previewVideo} autoPlay loop muted playsInline className="w-full aspect-video object-cover" />
            ) : (
              <img src={previewVideo} className="w-full aspect-video object-cover" alt="Preview Background" />
            )}
          </div>

          {/* Mini preview de las tarjetas */}
          <div className="w-full mt-6 grid grid-cols-2 gap-2 opacity-50 pointer-events-none scale-90">
             <div className="bg-white/10 p-3 rounded-xl border border-white/20"><p className="text-white font-bold text-xs">{config.b1Titulo}</p></div>
             <div className="bg-white/10 p-3 rounded-xl border border-white/20"><p className="text-white font-bold text-xs">{config.b2Titulo}</p></div>
             <div className="bg-white/10 p-3 rounded-xl border border-white/20"><p className="text-white font-bold text-xs">{config.b3Titulo}</p></div>
             <div className="bg-white/10 p-3 rounded-xl border border-white/20"><p className="text-white font-bold text-xs">{config.b4Titulo}</p></div>
          </div>
          
          <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay pointer-events-none rounded-[2rem]"></div>
        </div>

        <div className="flex flex-col items-end gap-3 pt-4 max-w-4xl mx-auto">
          <AnimatePresence>
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-bold border border-green-200">
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-bold border border-red-200 flex items-center gap-2">
                <AlertCircle size={16} /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-blue-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            {loading ? "Guardando..." : "Guardar Cambios"}
          </motion.button>
        </div>

        </div>

      </main>
    </div>
  );
}
