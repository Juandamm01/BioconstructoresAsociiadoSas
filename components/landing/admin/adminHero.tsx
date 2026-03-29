"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Save, ArrowLeft, Video, Type } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AdminHeroPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Form state
  const [videoUrl, setVideoUrl] = useState("/videos/hero1.mp4");
  const [bienvenido, setBienvenido] = useState("Bienvenido a");
  const [empresa, setEmpresa] = useState("Bioconstructores Asociados Sas");
  const [slogan, setSlogan] = useState("Soluciones Innovadoras Para Un Mundo Conectado.");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (res.ok && data.id) {
        setVideoUrl(data.videoUrl);
        setBienvenido(data.bienvenido);
        setEmpresa(data.empresa);
        setSlogan(data.slogan);
      }
    } catch (err) {
      console.error("Error al cargar configuración:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          bienvenido,
          empresa,
          slogan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Error al actualizar la configuración.");
      } else {
        setFormSuccess("✓ Configuración del Hero actualizada correctamente.");
      }
    } catch (err) {
      setFormError("Ocurrió un error inesperado al intentar actualizar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setFormError("Solo se permiten archivos de video.");
      return;
    }

    setUploading(true);
    setFormError("");
    setFormSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Error al cargar el video.");
      } else {
        setVideoUrl(data.url);
        setFormSuccess("✓ Video cargado satisfactoriamente. Dale a 'Guardar Cambios' para aplicar.");
      }
    } catch (err) {
      setFormError("Ocurrió un error al subir el video.");
    } finally {
      setUploading(false);
    }
  };

  const goToDashboard = () => {
    router.push("/#home");
  };

  if (isPending || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-white/70">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <header className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/images/bcas-logo.png" alt="BCAS" className="h-8 w-auto" />
          <div>
            <h1 className="font-bold text-lg leading-none text-white">Administrador de la Página</h1>
            <p className="text-blue-200 text-xs mt-0.5">Editor del Hero Section</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goToDashboard}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-800 hover:bg-blue-700 rounded-md transition-colors text-white"
          >
            <ArrowLeft size={12} /> Ver Cambios
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border border-blue-100 p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center">
              <Video size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-blue-950 text-xl">Editar Hero Section</h2>
              <p className="text-blue-950/50 text-xs">Modifica el video y los textos principales de la portada</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                <AlertCircle size={16} /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                {formSuccess}
              </div>
            )}

            {/* Video Config */}
            <div className="p-5 bg-blue-50/50 rounded-2xl space-y-4 border border-blue-100/50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <Video size={14} /> Fondo de Video
                </h3>
                {uploading && (
                  <span className="text-[10px] text-blue-600 animate-pulse font-bold">Subiendo archivo...</span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative group flex-1">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl p-6 bg-white cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group-active:scale-[0.98]"
                    >
                      <Video className="text-blue-200 group-hover:text-blue-500 mb-2 transition-colors" size={24} />
                      <span className="text-xs font-bold text-blue-900 group-hover:text-blue-600">
                        {uploading ? "Cargando video..." : "Seleccionar video desde archivos"}
                      </span>
                      <p className="text-[9px] text-blue-900/40 mt-1 uppercase tracking-widest font-black">Compu o Galería</p>
                    </label>
                  </div>

                  <div className="md:w-1/3 space-y-2">
                    <label className="text-[10px] font-bold text-blue-950/70 uppercase">Ruta actual</label>
                    <input
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      placeholder="/videos/hero1.mp4"
                      className="w-full px-3 py-2.5 text-xs border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 text-blue-950/60 bg-white/50"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-blue-950/50">
                  <span className="font-bold">Nota:</span> Se recomienda usar videos MP4 menores a 10MB para que la web cargue rápido.
                </p>
              </div>
            </div>

            {/* Text Config */}
            <div className="p-5 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Type size={14} /> Textos de Portada
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-blue-950/70 mb-1.5 block">Frase inicial</label>
                  <input
                    value={bienvenido}
                    onChange={e => setBienvenido(e.target.value)}
                    placeholder="Bienvenido a"
                    className="w-full px-4 py-2.5 text-sm border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-blue-950 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-blue-950/70 mb-1.5 block">Nombre corporativo</label>
                  <input
                    value={empresa}
                    onChange={e => setEmpresa(e.target.value)}
                    placeholder="Bioconstructores Asociados Sas"
                    className="w-full px-4 py-2.5 text-sm border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-blue-950 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-950/70 mb-1.5 block">Slogan / Subtítulo</label>
                <textarea
                  value={slogan}
                  onChange={e => setSlogan(e.target.value)}
                  placeholder="Soluciones Innovadoras..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-blue-950 bg-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-blue-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
              >
                <Save size={18} />
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
