"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Map, 
  Settings, 
  Bell, 
  LogOut, 
  Search, 
  Users, 
  CheckCircle, 
  Video, 
  CreditCard,
  Edit2,
  Camera,
  Activity
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";

interface AdminData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  sessions: { updatedAt: Date }[];
}

export default function AdminDashboard({ session, admins, stats }: { session: any, admins: AdminData[], stats: any }) {
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(session.user.name || "");
  const [profileImage, setProfileImage] = useState(session.user.image || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animaciones más fluidas y elegantes
    const tl = gsap.timeline();
    tl.fromTo(".sidebar-anim", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" })
      .fromTo(".header-anim", { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .fromTo(".card-anim", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power2.out" }, 
      "-=0.4");
  }, { scope: dashboardRef });

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/admin") }
    });
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    await authClient.updateUser({
      name: profileName,
      image: profileImage,
    });
    setSavingProfile(false);
    setIsEditingProfile(false);
    router.refresh(); // refresca el server prop
  };

  return (
    <div ref={dashboardRef} className="flex min-h-screen bg-slate-50 font-poppins text-blue-950">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar-anim hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-5 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 px-2 select-none">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm p-1 border border-slate-100">
            <img src="/images/bcas-logo.png" alt="Bioconstructores Asociados SAS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-[13px] font-black leading-tight text-blue-950">Bioconstructores<br/><span className="text-blue-600 font-medium text-[10px] uppercase tracking-wider">Asociados SAS</span></h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem active icon={<LayoutDashboard size={20} />} label="Dashboard" href="/admin/dashboard" />
          <NavItem icon={<Map size={20} />} label="Sectores Geográficos" href="/admin/admin-sectores" />
          <NavItem icon={<CreditCard size={20} />} label="Planes y Horarios" href="/admin/admin-plans" />
          <NavItem icon={<Video size={20} />} label="Hero Principal" href="/admin/admin-hero" />
          <NavItem icon={<Settings size={20} />} label="Configuración" href="#" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Salir de sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="header-anim sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-end border-b border-slate-200/50 shadow-xs">

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-full border border-slate-200 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200"></div>

            <button 
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-3 hover:bg-white p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            >
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-sm">
                  {session.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-blue-950 leading-none">{session.user.name}</p>
                <p className="text-xs text-slate-500 leading-none mt-1">Admin Manager</p>
              </div>
            </button>
          </div>
        </header>

        {/* CONTENIDO */}
        <div className="p-6 md:p-8 pt-4 pb-20 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6 card-anim">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-blue-950">Panel de Control</h2>
              <p className="text-sm text-slate-500 mt-1">Monitorea y edita el contenido principal de tu web.</p>
            </div>
          </div>

          {/* MENSAJE DE MOTIVACIÓN EN VEZ DE STATS VACÍOS */}
          <div className="bg-linear-to-r from-blue-950 to-blue-900 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl relative overflow-hidden card-anim">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-xl md:text-2xl font-black mb-2 text-white/90">¡Hola, {session.user.name.split(' ')[0]}!</h2>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Sigamos construyendo soluciones innovadoras y expandiendo nuestra cobertura para un mundo conectado. Tu gestión administrativa es clave para proyectar y posicionar a <strong className="text-white">Bioconstructores Asociados SAS</strong> como líder en la región.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <img src="/images/bcas-logo.png" className="w-64 h-64 object-contain filter grayscale invert" alt="BCAS Logo" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SECCIÓN ACCESOS DIRECTOS */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold card-anim flex items-center gap-2"><Edit2 size={20} className="text-blue-500"/> Accesos Directos de Edición</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ShortcutCard 
                  title="Hero Principal" 
                  desc="Ajusta el video y los textos principales de la pantalla de bienvenida."
                  link="/admin/admin-hero"
                  icon={<Video size={24} className="text-blue-600" />}
                  color="bg-blue-50"
                  delay="delay-100"
                />
                <ShortcutCard 
                  title="Sectores / Barrios" 
                  desc="Dibuja y edita polígonos de cobertura en el mapa interactivo."
                  link="/admin/admin-sectores"
                  icon={<Map size={24} className="text-cyan-600" />}
                  color="bg-cyan-50"
                  delay="delay-200"
                />
                <ShortcutCard 
                  title="Planes y Horarios" 
                  desc="Modifica los paquetes de servicio, precios y horarios de atención."
                  link="/admin/admin-plans"
                  icon={<CreditCard size={24} className="text-indigo-600" />}
                  color="bg-indigo-50"
                  delay="delay-300"
                />
              </div>
            </div>

            {/* SECCIÓN ADMINS E HISTORIAL */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs card-anim space-y-6">
              <h3 className="text-lg font-bold flex justify-between items-center">
                Administradores <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{admins.length} activos</span>
              </h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {admins.map((admin, idx) => {
                  const lastActive = admin.sessions.length > 0 
                      ? new Date(admin.sessions[0].updatedAt).toLocaleDateString()
                      : "Nunca";
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      {admin.image ? (
                        <img src={admin.image} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-blue-950 truncate">{admin.name}</p>
                        <p className="text-xs text-slate-500 truncate">{admin.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Últ. vez</p>
                        <p className="text-xs font-medium text-slate-700">{lastActive}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Banner Decorativo (similar to right side panel on Course mockup) */}
              <div className="mt-8 relative overflow-hidden bg-linear-to-br from-blue-950 to-blue-800 rounded-2xl p-5 text-white">
                <div className="relative z-10 w-3/4">
                  <h4 className="font-bold text-sm mb-1">¡Mantén seguro el sitio!</h4>
                  <p className="text-[10px] text-blue-200 mb-3">Recuerda cerrar sesión en equipos que no sean tuyos.</p>
                  <button onClick={handleLogout} className="bg-white text-blue-950 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100">Cerrar Sesión</button>
                </div>
                <Users size={80} className="absolute -bottom-4 -right-4 text-white/10" />
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── MODAL DE EDICIÓN DE PERFIL ── */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Settings size={20}/> Editar Mi Perfil</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nombre Mostrado</label>
                  <input 
                    type="text" 
                    value={profileName}
                    disabled
                    className="w-full border-2 border-slate-100 bg-slate-50 cursor-not-allowed text-slate-500 rounded-xl px-4 py-2 focus:outline-none" 
                  />
                  <p className="text-[10px] text-slate-400 mt-1">El nombre se modifica desde Configuración.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Foto de Perfil</label>
                  
                  <div className="flex flex-col gap-3">
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="profile-upload"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setSavingProfile(true);
                          const formData = new FormData();
                          formData.append("file", file);
                          
                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData,
                            });
                            const data = await res.json();
                            if (res.ok) setProfileImage(data.url);
                          } catch (err) {
                            console.error("Error al subir imagen:", err);
                          } finally {
                            setSavingProfile(false);
                          }
                        }}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="profile-upload"
                        className="flex items-center gap-3 w-full border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-xl px-4 py-3 cursor-pointer bg-blue-50/30 transition-colors"
                      >
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                          <Camera size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-bold text-blue-900 block">Subir desde la computadora</span>
                          <span className="text-[10px] text-slate-500 leading-tight">Formatos: JPG, PNG, WEBP</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center gap-3 relative">
                      <div className="flex-1 h-px bg-slate-100"></div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">O usa URL</span>
                      <div className="flex-1 h-px bg-slate-100"></div>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="text" 
                        value={profileImage}
                        onChange={e => setProfileImage(e.target.value)}
                        placeholder="https://tudominio.com/foto.jpg"
                        className="w-full border-2 border-slate-100 rounded-xl pl-9 pr-4 py-2 focus:border-blue-500 focus:outline-none text-xs bg-slate-50" 
                      />
                      <Camera size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancelar</button>
                  <button onClick={saveProfile} disabled={savingProfile} className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                    {savingProfile ? "Guardando..." : "Guardar Perfil"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE NAV (Bottom Bar) ── */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-40 flex justify-around p-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <MobileNavItem icon={<LayoutDashboard size={20} />} label="Dash" href="/admin/dashboard" active />
        <MobileNavItem icon={<Map size={20} />} label="Sectores" href="/admin/admin-sectores" />
        <MobileNavItem icon={<CreditCard size={20} />} label="Planes" href="/admin/admin-plans" />
        <MobileNavItem icon={<Video size={20} />} label="Hero" href="/admin/admin-hero" />
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 p-2 text-red-500 hover:text-red-700 transition-colors">
          <LogOut size={20} />
          <span className="text-[10px] font-bold">Salir</span>
        </button>
      </nav>
    </div>
  );
}

// ── COMPONENTES INTERNOS DE APOYO ──

function MobileNavItem({ icon, label, href, active }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${active ? 'text-blue-950' : 'text-slate-400'}`}>
      <div className={`${active ? 'bg-blue-100 text-blue-900' : 'bg-transparent'} p-1.5 rounded-lg`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-blue-950' : 'text-slate-500'}`}>{label}</span>
    </Link>
  );
}

function NavItem({ icon, label, href, active }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm group
      ${active ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-950'}
    `}>
      <span className={active ? '' : 'group-hover:text-blue-950 transition-colors'}>{icon}</span>
      <span>{label}</span>
      {active && <motion.div layoutId="nav-marker" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>
  )
}

function StatCard({ title, value, subtitle, trend, trendUp, cardClass }: any) {
  return (
    <div className={`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs ${cardClass}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black">{value}</span>
        {subtitle && <span className="text-xs text-slate-400 font-medium">{subtitle}</span>}
      </div>
    </div>
  )
}

function ShortcutCard({ title, desc, link, icon, color, delay }: any) {
  return (
    <Link href={link} className={`block bg-white border border-slate-200 rounded-3xl p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group card-anim ${delay}`}>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 leading-snug">{desc}</p>
    </Link>
  )
}
