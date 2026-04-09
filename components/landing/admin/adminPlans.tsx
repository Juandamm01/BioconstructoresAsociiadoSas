"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Plus, Trash2, ArrowLeft, Save, GripVertical } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

let cachedPlansData: any = null;

type PlanItem = { name: string; price: string };
type PlanGroup = { title: string; subtitle: string; badge: string; isPremium: boolean; items: PlanItem[] };

export default function AdminPlansPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [schedule, setSchedule] = useState(cachedPlansData?.schedule || {
    dia1: "Lun - Vie", hora1: "8am - 12pm / 2pm - 5pm",
    dia2: "Sábados", hora2: "8am - 1pm",
    dia3: "Domingos", hora3: "Cerrado"
  });

  const [groups, setGroups] = useState<PlanGroup[]>(cachedPlansData?.groups || []);
  const [loading, setLoading] = useState(!cachedPlansData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isPending && !session) router.push("/admin");
  }, [session, isPending, router]);

  const fetchData = async () => {
    if (cachedPlansData) {
      setSchedule(cachedPlansData.schedule);
      setGroups(cachedPlansData.groups);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      
      const newSchedule = data.schedule || {
        dia1: "Lun - Vie", hora1: "8am - 12pm / 2pm - 5pm",
        dia2: "Sábados", hora2: "8am - 1pm",
        dia3: "Domingos", hora3: "Cerrado"
      };

      let newGroups = [];
      if (data.groups && data.groups.length > 0) {
        newGroups = data.groups;
      } else {
        newGroups = [
          { title: "La Nohora y San Luis", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{ name: "50MB +1TV", price: "$68K" }, { name: "100MB +2TV", price: "$95K" }, { name: "200MB +2TV", price: "$105K" }] },
          { title: "La Zuria", subtitle: "Susc.: $89.000", badge: "", isPremium: false, items: [{ name: "50MB +1TV", price: "$105K" }, { name: "25MB +1TV", price: "$85K" }, { name: "25MB Solo", price: "$75K" }] },
          { title: "Mesetas, El Triángulo, La Sultana...", subtitle: "", badge: "$99.000 Susc.", isPremium: true, items: [{ name: "50 MB - $68K", price: "+1 TV" }, { name: "100 MB - $95K", price: "+2 TV" }, { name: "200 MB - $105K", price: "+2 TV" }] }
        ];
      }
      
      setSchedule(newSchedule);
      setGroups(newGroups);
      cachedPlansData = { schedule: newSchedule, groups: newGroups };
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
      if (res.ok) {
        setSuccess("Los planes y horarios se actualizaron correctamente.");
        cachedPlansData = { schedule, groups };
      }
      else setError("Hubo un error al guardar los cambios.");
    } catch (err) {
      setError("Fallo de conexión.");
    }
    setSaving(false);
  };

  const updateSchedule = (key: keyof typeof schedule, value: string) => setSchedule((prev: any) => ({ ...prev, [key]: value }));

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

  return (
    <div className="flex min-h-screen bg-slate-50 font-poppins text-blue-950">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden pb-6">
        <AdminHeader title="Editor de Planes y Horarios" />

        <div className="max-w-full 2xl:max-w-7xl mx-auto w-full px-4 xl:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
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
        <section className="w-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm md:text-base font-bold text-blue-950">Secciones de Precios</h2>
            <button onClick={addGroup} className="text-xs bg-blue-950 text-white hover:bg-blue-900 px-3 py-2 rounded-lg flex items-center justify-center gap-1 font-semibold transition-all shadow-sm">
              <Plus size={14} /> Añadir Sección
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 items-start">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="w-full bg-slate-100/50 rounded-xl h-[340px] animate-pulse border border-slate-200" />
              ))
            ) : (
              <AnimatePresence>
              {groups.map((group, gi) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ type: "spring", bounce: 0, duration: 0.25, delay: gi * 0.05 }} key={gi} className={`w-full bg-white hover:shadow-md transition-shadow duration-300 rounded-xl shadow-sm border p-4 md:p-5 ${group.isPremium ? 'border-amber-400/50 bg-amber-50/30' : 'border-blue-100'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-5 relative">
                    <div className="flex-1 w-full space-y-3 md:pr-8">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Zona / Barrio(s)</label>
                        <input value={group.title} onChange={e => updateGroup(gi, 'title', e.target.value)} className="w-full font-bold text-sm text-blue-950 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Subtítulo</label>
                          <input value={group.subtitle || ""} onChange={e => updateGroup(gi, 'subtitle', e.target.value)} className="w-full text-xs text-blue-900 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Badge</label>
                          <input value={group.badge || ""} onChange={e => updateGroup(gi, 'badge', e.target.value)} className="w-full text-xs text-amber-900 p-2 bg-amber-50 border border-amber-200/50 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id={`premium-${gi}`} checked={group.isPremium} onChange={e => updateGroup(gi, 'isPremium', e.target.checked)} className="rounded text-blue-600 w-4 h-4 cursor-pointer" />
                        <label htmlFor={`premium-${gi}`} className="text-xs cursor-pointer text-slate-600 font-medium select-none">Mostrar como sección Premium</label>
                      </div>
                    </div>
                    <button onClick={() => removeGroup(gi)} className="absolute right-0 top-0 md:static text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar Sección">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200 p-3 sm:p-4 rounded-xl mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Planes de esta Zona
                      </h4>
                      <button onClick={() => addItemToGroup(gi)} className="text-white flex items-center gap-1 font-bold text-[10px] uppercase bg-blue-900 hover:bg-blue-950 transition-colors px-2 py-1 rounded-md shadow-xs">
                        <Plus size={12} /> Plan
                      </button>
                    </div>

                    {group.items.length === 0 && <p className="text-xs text-slate-400 italic text-center py-2">No hay planes. Añade uno.</p>}

                    <div className="space-y-2">
                      {group.items.map((item, ii) => (
                        <div key={ii} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-1.5 bg-white border border-slate-200 p-2 sm:p-1.5 rounded-lg group hover:border-blue-300 transition-colors shadow-xs">
                          <div className="hidden sm:block"><GripVertical size={14} className="text-slate-300" /></div>
                          <div className="flex-1 w-full grid grid-cols-[1.5fr_1fr] gap-2 sm:gap-1.5">
                            <input value={item.name} onChange={e => updateItem(gi, ii, 'name', e.target.value)} placeholder="Ej: 50MB +1TV" className="w-full text-xs font-bold text-slate-700 px-2 py-2 sm:py-1.5 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all placeholder-slate-400" />
                            <input value={item.price} onChange={e => updateItem(gi, ii, 'price', e.target.value)} placeholder="Ej: $68K" className="w-full text-xs font-black text-blue-950 px-2 py-2 sm:py-1.5 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all text-center placeholder-slate-400" />
                          </div>
                          <div className="w-full sm:w-auto flex justify-end">
                            <button onClick={() => removeItemFromGroup(gi, ii)} className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            )}
          </div>
        </section>

        <div className="flex justify-end pt-4 max-w-full 2xl:max-w-7xl mx-auto w-full px-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </motion.button>
        </div>

        </div>

      </main>
    </div>
  );
}
