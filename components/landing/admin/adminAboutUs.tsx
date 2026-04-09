"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, FileText, Image as ImageIcon, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export default function AdminAboutUsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Form state
  const [titulo, setTitulo] = useState("Nosotros");
  const [parrafo1, setParrafo1] = useState("");
  const [parrafo2, setParrafo2] = useState("");
  const [imagen1, setImagen1] = useState("/images/bcas1.jpg");
  const [imagen2, setImagen2] = useState("/images/bcas2.jpg");
  const [imagen3, setImagen3] = useState("/images/bcas3.jpg");
  const [imagen4, setImagen4] = useState("/images/bcas4.jpg");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (res.ok && data.id) {
        setTitulo(data.titulo);
        setParrafo1(data.parrafo1);
        setParrafo2(data.parrafo2);
        setImagen1(data.imagen1);
        setImagen2(data.imagen2);
        setImagen3(data.imagen3);
        setImagen4(data.imagen4);
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
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          parrafo1,
          parrafo2,
          imagen1,
          imagen2,
          imagen3,
          imagen4,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Error al actualizar la configuración.");
      } else {
        setFormSuccess("✓ Configuración 'Nosotros' actualizada correctamente.");
      }
    } catch (err) {
      setFormError("Ocurrió un error inesperado al intentar actualizar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, oldUrl: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Solo se permiten archivos de imagen.");
      return;
    }

    setUploading(fieldName);
    setFormError("");
    setFormSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "about");
    if (oldUrl) {
      formData.append("oldUrl", oldUrl);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        if (fieldName === "imagen1") setImagen1(data.url);
        if (fieldName === "imagen2") setImagen2(data.url);
        if (fieldName === "imagen3") setImagen3(data.url);
        if (fieldName === "imagen4") setImagen4(data.url);
        setFormSuccess(`✓ Imagen actualizada correctamente.`);
      } else {
        setFormError(data.error || "Error al subir la imagen.");
      }
    } catch (err) {
      setFormError("Error de conexión al subir imagen.");
    } finally {
      setUploading(null);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  if (isPending || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderImageUploader = (label: string, fieldName: string, imageUrl: string) => (
    <div className="mt-4 p-4 border border-slate-100 rounded-xl bg-slate-50 mb-3">
      <label className="text-sm font-bold text-slate-700 block mb-2">{label}</label>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {imageUrl ? (
          <img src={imageUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
        ) : (
          <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300">
            <ImageIcon size={24} className="text-slate-400" />
          </div>
        )}
        <div className="flex-1 w-full relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => handleFileUpload(e, fieldName, imageUrl)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            disabled={uploading !== null}
          />
          <div className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-white transition-colors bg-white/50">
            {uploading === fieldName ? (
               <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
               <Upload size={18} className="text-blue-500" />
            )}
            <span className="text-sm font-semibold text-slate-600">
              {uploading === fieldName ? "Subiendo..." : "Cambiar Imagen..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-poppins text-blue-950">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
        <AdminHeader title="Editor Sección Nosotros" />

        <div className="flex-1 p-6 md:p-8 pt-4 w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/60 overflow-hidden mb-12">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-950">Sección "Quiénes Somos"</h2>
                  <p className="text-sm text-slate-500">Configura el título, textos y fotos del apartado de Nosotros.</p>
                </div>
              </div>

              {formError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                  <span className="mt-0.5">⚠️</span> <span>{formError}</span>
                </motion.div>
              )}

              {formSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 font-medium">
                  {formSuccess}
                </motion.div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    className="w-full border-2 border-slate-100 bg-slate-50 text-blue-950 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    placeholder="Nosotros"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Párrafo 1
                  </label>
                  <textarea
                    value={parrafo1}
                    onChange={(e) => setParrafo1(e.target.value)}
                    required
                    rows={4}
                    className="w-full border-2 border-slate-100 bg-slate-50 text-blue-950 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    placeholder="Escribe el primer párrafo..."
                  ></textarea>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Párrafo 2
                  </label>
                  <textarea
                    value={parrafo2}
                    onChange={(e) => setParrafo2(e.target.value)}
                    required
                    rows={4}
                    className="w-full border-2 border-slate-100 bg-slate-50 text-blue-950 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    placeholder="Escribe el segundo párrafo..."
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-md font-bold mb-2">Imágenes Flotantes</h3>
                  <p className="text-xs text-slate-500 mb-4">Estas 4 imágenes rotativas se muestran al lado del texto. Sube imágenes cuadradas o ligeramente rectangulares para mejor apariencia.</p>
                  
                  {renderImageUploader("Imagen 1", "imagen1", imagen1)}
                  {renderImageUploader("Imagen 2", "imagen2", imagen2)}
                  {renderImageUploader("Imagen 3", "imagen3", imagen3)}
                  {renderImageUploader("Imagen 4", "imagen4", imagen4)}
                </div>

                <div className="pt-6 mt-8 flex border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="ml-auto px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-sm shadow-blue-950/20"
                  >
                    <Save size={18} />
                    {submitting ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
