"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Plus, Trash2, ArrowLeft, Save, GripVertical } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type PlanItem = { name: string; price: string };
type PlanGroup = { title: string; subtitle: string; badge: string; isPremium: boolean; items: PlanItem[] };

export default function AdminPlansPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [schedule, setSchedule] = useState({
    dia1: "Lun - Vie", hora1: "8am - 12pm / 2pm - 5pm",
    dia2: "Sábados", hora2: "8am - 1pm",
    dia3: "Domingos", hora3: "Cerrado"
  });

  const [groups, setGroups] = useState<PlanGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isPending && !session) router.push("/admin");
  }, [session, isPending, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (data.schedule) setSchedule(data.schedule);
      if (data.groups && data.groups.length > 0) {
        setGroups(data.groups);
      } else {
        setGroups([
          { title: "La Nohora y San Luis", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{ name: "50MB +1TV", price: "$68K" }, { name: "100MB +2TV", price: "$95K" }, { name: "200MB +2TV", price: "$105K" }] },
          { title: "La Zuria", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{ name: "50MB +1TV", price: "$105K" }, { name: "25MB +1TV", price: "$85K" }, { name: "25MB Solo", price: "$75K" }] },
          { title: "Mesetas, El Triángulo, La Sultana...", subtitle: "", badge: "$99.000 Susc.", isPremium: true, items: [{ name: "50 MB - $68K", price: "+1 TV" }, { name: "100 MB - $95K", price: "+2 TV" }, { name: "200 MB - $105K", price: "+2 TV" }] }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setError(""); setSuccess(""); setSaving(true);
    try {
      const res = await fetch("/api/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule, groups })
      });
      if (res.ok) setSuccess("Los planes y horarios se actualizaron correctamente.");
      else setError("Hubo un error al guardar los cambios.");
    } catch (err) {
      setError("Fallo de conexión.");
    }
    setSaving(false);
  };

  const updateSchedule = (key: keyof typeof schedule, value: string) => setSchedule(prev => ({ ...prev, [key]: value }));

  const addGroup = () => setGroups([...groups, { title: "Nuevo Plan", subtitle: "", badge: "", isPremium: false, items: [{ name: "", price: "" }] }]);
  const removeGroup = (i: number) => setGroups(groups.filter((_, idx) => idx !== i));
  const updateGroup = (i: number, key: keyof PlanGroup, value: any) => {
    const newGroups = [...groups];
    newGroups[i] = { ...newGroups[i], [key]: value };
    setGroups(newGroups);
  };

  const addItemToGroup = (gi: number) => {
    const newGroups = [...groups];
    newGroups[gi].items.push({ name: "", price: "" });
    setGroups(newGroups);
  };
  const removeItemFromGroup = (gi: number, ii: number) => {
    const newGroups = [...groups];
    newGroups[gi].items = newGroups[gi].items.filter((_, idx) => idx !== ii);
    setGroups(newGroups);
  };
  const updateItem = (gi: number, ii: number, key: keyof PlanItem, val: string) => {
    const newGroups = [...groups];
    newGroups[gi].items[ii] = { ...newGroups[gi].items[ii], [key]: val };
    setGroups(newGroups);
  };

  const goToPlans = () => {
    router.push("/admin/dashboard");
  };

  if (isPending || loading) return <div className="min-h-screen bg-blue-950 flex items-center justify-center text-white font-[family-name:var(--font-poppins)]">Cargando...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-[family-name:var(--font-poppins)] pb-12">
      <header className="bg-blue-950 text-white px-3 md:px-4 py-2.5 md:py-3 flex flex-wrap items-center justify-between gap-2 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/images/bcas-logo.png" alt="BCAS" className="h-8 w-auto" />
          <div>
            <h1 className="font-bold text-sm md:text-lg leading-none">Gestión de Planes</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goToPlans} className="flex items-center gap-1 text-[10px] md:text-xs px-2 md:px-3 py-1.5 bg-slate-600 hover:bg-slate-700 rounded-md transition-colors">
            <ArrowLeft size={12} /> Volver al Dashboard
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 text-[10px] md:text-xs px-2 md:px-4 py-1.5 bg-green-600 hover:bg-green-500 font-bold rounded-md transition-colors disabled:opacity-70">
            {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Guardar Cambios
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8">
        {(error || success) && (
          <div className={`p-3 rounded-xl flex items-center gap-2 text-xs ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            <AlertCircle size={18} /> <span className="text-sm font-semibold">{error || success}</span>
          </div>
        )}

        {/* ── SECCIÓN HORARIOS ── */}
        <section className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-blue-100 p-4 md:p-6">
          <h2 className="text-sm md:text-base font-bold text-blue-950 mb-4 flex items-center gap-2">🕒 Horarios de Atención</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
              <input value={schedule.dia1} onChange={e => updateSchedule('dia1', e.target.value)} className="w-full text-xs font-bold text-blue-950 bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-500 pb-1" placeholder="Ej: Lun - Vie" />
              <input value={schedule.hora1} onChange={e => updateSchedule('hora1', e.target.value)} className="w-full text-xs text-blue-900 bg-transparent focus:outline-none" placeholder="8am - 12pm..." />
            </div>
            <div className="space-y-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
              <input value={schedule.dia2} onChange={e => updateSchedule('dia2', e.target.value)} className="w-full text-xs font-bold text-blue-950 bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-500 pb-1" placeholder="Ej: Sábados" />
              <input value={schedule.hora2} onChange={e => updateSchedule('hora2', e.target.value)} className="w-full text-xs text-blue-900 bg-transparent focus:outline-none" placeholder="8am - 1pm" />
            </div>
            <div className="space-y-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
              <input value={schedule.dia3} onChange={e => updateSchedule('dia3', e.target.value)} className="w-full text-xs font-bold text-blue-950 bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-500 pb-1" placeholder="Ej: Domingos" />
              <input value={schedule.hora3} onChange={e => updateSchedule('hora3', e.target.value)} className="w-full text-xs text-blue-900 bg-transparent focus:outline-none" placeholder="Cerrado" />
            </div>
          </div>
        </section>

        {/* ── SECCIÓN CARDS (Grupos de Planes) ── */}
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm md:text-base font-bold text-blue-950">Secciones de Precios</h2>
            <button onClick={addGroup} className="text-xs bg-blue-100 text-blue-900 hover:bg-blue-200 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-semibold transition-colors">
              <Plus size={14} /> Añadir Sección
            </button>
          </div>

          <div className="flex flex-col items-center gap-6">
            <AnimatePresence>
              {groups.map((group, gi) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} key={gi} className={`w-full max-w-lg bg-white hover:shadow-md transition-shadow duration-300 rounded-xl shadow-sm border p-4 md:p-5 ${group.isPremium ? 'border-amber-400/50 bg-amber-50/30' : 'border-blue-100'}`}>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1 grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-blue-950 ml-1">Zona / Barrio(s)</label>
                        <input value={group.title} onChange={e => updateGroup(gi, 'title', e.target.value)} className="w-full font-bold text-sm text-blue-950 p-2 border border-blue-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-blue-950 ml-1">Subtítulo (Opcional)</label>
                        <input value={group.subtitle || ""} onChange={e => updateGroup(gi, 'subtitle', e.target.value)} className="w-full text-xs text-blue-900 p-2 border border-blue-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-blue-950 ml-1">Badge Resaltado (Opcional)</label>
                        <input value={group.badge || ""} onChange={e => updateGroup(gi, 'badge', e.target.value)} className="w-full text-xs text-amber-900 p-2 border border-amber-200/50 bg-amber-50/50 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500" />
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <input type="checkbox" id={`premium-${gi}`} checked={group.isPremium} onChange={e => updateGroup(gi, 'isPremium', e.target.checked)} className="rounded text-blue-600 w-4 h-4 cursor-pointer" />
                        <label htmlFor={`premium-${gi}`} className="text-xs cursor-pointer text-blue-950 font-medium select-none">Sección ancha (Premium)</label>
                      </div>
                    </div>
                    <button onClick={() => removeGroup(gi)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar Sección">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg mt-3">
                    <h4 className="text-[11px] font-bold text-blue-950 mb-2 flex items-center justify-between">
                      Planes en esta Zona
                      <button onClick={() => addItemToGroup(gi)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-[10px] uppercase bg-blue-100 hover:bg-blue-200 transition-colors px-2 py-1 rounded-md">
                        <Plus size={12} /> Añadir Plan
                      </button>
                    </h4>

                    {group.items.length === 0 && <p className="text-xs text-slate-400 italic">No hay planes. Añade uno.</p>}

                    <div className="space-y-2">
                      {group.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg group hover:border-blue-200 transition-colors">
                          <GripVertical size={14} className="text-slate-300" />
                          <input value={item.name} onChange={e => updateItem(gi, ii, 'name', e.target.value)} placeholder="Ej: 50MB +1TV" className="flex-1 text-xs text-blue-950 px-2 py-1 border border-transparent hover:border-slate-100 focus:border-blue-300 focus:bg-white bg-slate-50 rounded focus:outline-none transition-all" />
                          <input value={item.price} onChange={e => updateItem(gi, ii, 'price', e.target.value)} placeholder="Ej: $68K" className="w-[100px] text-xs font-bold text-blue-950 px-2 py-1 border border-transparent hover:border-slate-100 focus:border-blue-300 focus:bg-white bg-slate-50 rounded focus:outline-none text-right transition-all" />
                          <button onClick={() => removeItemFromGroup(gi, ii)} className="text-slate-400 hover:text-red-500 p-1 opacity-50 group-hover:opacity-100 transition-opacity"><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
}
