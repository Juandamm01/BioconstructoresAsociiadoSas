"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Plus, Trash2, MapPin, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AdminSidebar } from "./AdminSidebar";

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
    router.push("/admin/dashboard");
  };

  // Allow it to render so the sidebar feels instantaneous

  return (
    <div className="flex min-h-screen bg-slate-50 font-poppins text-blue-950">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden pb-12">
        {/* Header */}
        <header className="bg-white text-blue-950 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-10 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-lg leading-none">Gestión de Sectores</h1>
            </div>
          </div>
        </header>

        <div className="w-[95%] max-w-6xl mx-auto w-full px-2 md:px-3 py-3 md:py-6 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] lg:grid-cols-[400px_1fr] gap-4 md:gap-6">
        {/* Formulario añadir */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[1rem] md:rounded-[1.2rem] shadow-md border border-blue-50 p-2.5 md:p-4"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-6 h-6 bg-blue-950 rounded-md flex items-center justify-center">
              <Plus size={12} className="text-white" />
            </div>
            <h2 className="font-bold text-blue-950 text-[11px] md:text-[13px]">Añadir Sector</h2>
          </div>

          <form onSubmit={handleAdd} className="space-y-2.5">
            {formError && (
              <div className="flex items-center gap-1.5 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-[10px] md:text-xs">
                <AlertCircle size={12} /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs font-medium">
                {formSuccess}
              </div>
            )}

            <div>
              <label className="text-[11px] md:text-xs font-semibold text-blue-950/70 mb-1 block">Nombre del sector *</label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Mesetas Bajas"
                className="w-full px-3 py-1.5 md:py-2 text-[11px] md:text-sm border border-blue-50 bg-slate-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950 text-blue-950 placeholder-blue-950/30"
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
              className="w-full py-2 bg-blue-950 text-white rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-blue-900 transition-colors"
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
          className="bg-white rounded-[1rem] md:rounded-[1.2rem] shadow-md border border-blue-50 p-2.5 md:p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-blue-950 rounded-md flex items-center justify-center">
                <MapPin size={12} className="text-white" />
              </div>
              <h2 className="font-bold text-blue-950 text-[11px] md:text-[13px]">Sectores Activos</h2>
            </div>
            <span className="bg-blue-100 text-blue-950 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full">
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
            <ul className="space-y-1.5 max-h-[220px] md:max-h-[280px] overflow-y-auto pr-1">
              <AnimatePresence>
                {barrios.map(b => (
                  <motion.li
                    key={b.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between gap-1.5 p-1.5 md:p-2 rounded-lg border border-blue-50 hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white shadow"
                        style={{ backgroundColor: b.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-[10px] md:text-xs truncate">{b.nombre}</p>
                        <p className="text-[8px] md:text-[9px] text-gray-500 font-mono">
                          {b.lat.toFixed(4)}, {b.lng.toFixed(4)} · r:{b.radio}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(b.id, b.nombre)}
                      disabled={deleting === b.id}
                      title="Eliminar sector"
                      className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 rounded-md transition-all md:opacity-0 md:group-hover:opacity-100 disabled:opacity-50"
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
      </main>
    </div>
  );
}
