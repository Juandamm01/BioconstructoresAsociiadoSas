"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Plus, Trash2, MapPin, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Barrio = { id: number; nombre: string; lat: number; lng: number; color: string; radio: number };

export default function AdminSectoresPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [loadingBarrios, setLoadingBarrios] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Form state
  const [nombre, setNombre] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [color, setColor] = useState("#2563eb");
  const [radio, setRadio] = useState("350");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBarrios = async () => {
    setLoadingBarrios(true);
    const res = await fetch("/api/barrios");
    const data = await res.json();
    setBarrios(data);
    setLoadingBarrios(false);
  };

  useEffect(() => { fetchBarrios(); }, []);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!nombre || !lat || !lng) {
      setFormError("Nombre, latitud y longitud son obligatorios.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/barrios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        color,
        radio: parseInt(radio),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error || "Error al añadir el sector.");
    } else {
      setFormSuccess(`✓ Sector "${data.nombre}" añadido correctamente.`);
      setNombre(""); setLat(""); setLng(""); setColor("#2563eb"); setRadio("350");
      fetchBarrios();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number, nombreBarrio: string) => {
    if (!confirm(`¿Eliminar el sector "${nombreBarrio}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    await fetch(`/api/barrios/${id}`, { method: "DELETE" });
    await fetchBarrios();
    setDeleting(null);
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/admin") },
    });
  };

  const goToMap = () => {
    // Navigate to home first, then scroll past the GSAP pin zone (500px offset)
    router.push("/");
    // Small delay to let the page load before scrolling
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + 500;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 600);
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-950">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-white/70">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!session) return null; // Redirigiendo...

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <header className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/images/bcas-logo.png" alt="BCAS" className="h-8 w-auto" />
          <div>
            <h1 className="font-bold text-lg leading-none">Gestión de Sectores</h1>
            <p className="text-blue-200 text-xs mt-0.5">Bioconstructores Asociados SAS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-200 hidden md:block">
            Hola, <span className="text-white font-semibold">{session.user.name}</span>
          </span>
          <button
            onClick={goToMap}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-800 hover:bg-blue-700 rounded-md transition-colors"
          >
            <ArrowLeft size={12} /> Ver Mapa
          </button>
          <button
            onClick={goToMap}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-600 hover:bg-slate-700 rounded-md transition-colors"
          >
            <ArrowLeft size={12} /> Volver
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
        {/* Formulario añadir */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-md border border-blue-100 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
              <Plus size={16} className="text-white" />
            </div>
            <h2 className="font-bold text-blue-950 text-lg">Añadir Sector</h2>
          </div>

          <form onSubmit={handleAdd} className="space-y-3">
            {formError && (
              <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs">
                <AlertCircle size={13} /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs font-medium">
                {formSuccess}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-blue-950/70 mb-1 block">Nombre del sector *</label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Mesetas Bajas"
                className="w-full px-3 py-2 text-sm border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 text-blue-950 placeholder-blue-950/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-blue-950/70 mb-1 block">Latitud *</label>
                <input
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  placeholder="4.145460"
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 text-sm border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 text-blue-950 placeholder-blue-950/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-950/70 mb-1 block">Longitud *</label>
                <input
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                  placeholder="-73.655689"
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 text-sm border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 text-blue-950 placeholder-blue-950/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-blue-950/70 mb-1 block">Radio (metros)</label>
                <input
                  value={radio}
                  onChange={e => setRadio(e.target.value)}
                  placeholder="350"
                  type="number"
                  min="50"
                  max="5000"
                  className="w-full px-3 py-2 text-sm border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 text-blue-950 placeholder-blue-950/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-950/70 mb-1 block">Color del sector</label>
                <div className="flex items-center gap-2 border border-blue-100 rounded-lg px-2 py-1.5">
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono text-blue-950/60">{color}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-lg text-xs text-blue-700">
              <p className="font-semibold mb-1 flex items-center gap-1">
                <MapPin size={11} /> ¿Cómo encontrar coordenadas exactas?
              </p>
              <p>En Google Maps, haz clic derecho sobre el sector y copia las coordenadas que aparecen en el menú.</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-blue-950 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-blue-900 transition-colors"
            >
              <Plus size={15} />
              {submitting ? "Añadiendo..." : "Añadir Sector al Mapa"}
            </motion.button>
          </form>
        </motion.div>

        {/* Lista de barrios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md border border-blue-100 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <h2 className="font-bold text-blue-950 text-lg">Sectores Activos</h2>
            </div>
            <span className="bg-blue-100 text-blue-950 text-xs font-bold px-2.5 py-1 rounded-full">
              {barrios.length} registros
            </span>
          </div>

          {loadingBarrios ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : barrios.length === 0 ? (
            <p className="text-center text-blue-950/40 text-sm py-10">No hay sectores registrados aún.</p>
          ) : (
            <ul className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              <AnimatePresence>
                {barrios.map(b => (
                  <motion.li
                    key={b.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-blue-50 hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white shadow"
                        style={{ backgroundColor: b.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{b.nombre}</p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {b.lat.toFixed(5)}, {b.lng.toFixed(5)} · r: {b.radio}m
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(b.id, b.nombre)}
                      disabled={deleting === b.id}
                      title="Eliminar sector"
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      {deleting === b.id ? (
                        <span className="text-[10px]">...</span>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
