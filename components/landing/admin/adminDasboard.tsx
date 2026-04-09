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
  Camera,
  Activity,
  ExternalLink,
  FileText,
  Edit2
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  sessions: { updatedAt: Date }[];
}

export default function AdminDashboard({ session, admins, stats }: { session: any, admins: AdminData[], stats: any }) {
  const router = useRouter();
  const { data: activeSession } = authClient.useSession();
  const currentUser = activeSession?.user || session.user;
  // Usar estado local para optimismo visual Inmediato
  const [displayImage, setDisplayImage] = useState(currentUser.image);
  const [displayName, setDisplayName] = useState(currentUser.name);
  const [localAdmins, setLocalAdmins] = useState(admins);

  useEffect(() => {
    setDisplayImage(currentUser.image);
    setDisplayName(currentUser.name);
    setLocalAdmins(admins);
  }, [currentUser.image, currentUser.name, admins]);

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
      fetchOptions: { onSuccess: () => { window.location.href = "/admin"; } }
    });
  };

  return (
    <div ref={dashboardRef} className="flex min-h-screen bg-slate-50 font-poppins text-blue-950">
      <AdminSidebar />
      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* HEADER */}
        <AdminHeader title="Panel de Control" />

        {/* CONTENIDO */}
        <div className="p-6 md:p-8 pt-4 pb-12 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6 card-anim">
            <div>
              <p className="text-sm text-slate-500">Soluciones Innovadoras Para Un Mundo Conectado.</p>
            </div>
          </div>

          {/* MENSAJE DE MOTIVACIÓN EN VEZ DE STATS VACÍOS */}
          <div className="bg-linear-to-r from-blue-950 to-blue-900 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl relative overflow-hidden card-anim">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-xl md:text-2xl font-black mb-2 text-white/90">¡Hola, {displayName.split(' ')[0]}!</h2>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Avancemos en el desarrollo de proyectos sostenibles y ampliemos nuestra cobertura para un mundo conectado. Tu gestión administrativa es clave para proyectar y posicionar a <strong className="text-white">Bioconstructores Asociados SAS</strong> en Villavicencio.
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
                  title="Quiénes Somos" 
                  desc="Edita los textos y fotos de la sección Nosotros."
                  link="/admin/admin-about"
                  icon={<FileText size={24} className="text-orange-600" />}
                  color="bg-orange-50"
                  delay="delay-[150ms]"
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
                <ShortcutCard 
                  title="Políticas ISP" 
                  desc="Ajusta los textos normativos y videos explicativos del inicio."
                  link="/admin/admin-policy"
                  icon={<CheckCircle size={24} className="text-purple-600" />}
                  color="bg-purple-50"
                  delay="delay-400"
                />
                <ShortcutCard 
                  title="Portal Clientes" 
                  desc="Accede al panel de gestión de clientes de WispHub."
                  link="https://avisos.wisphub.net/saldo/bcas-sas/"
                  icon={<ExternalLink size={24} className="text-emerald-600" />}
                  color="bg-emerald-50"
                  delay="delay-500"
                  target="_blank"
                />
              </div>
            </div>

            {/* SECCIÓN ADMINS E HISTORIAL */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs card-anim space-y-6">
              <h3 className="text-lg font-bold flex justify-between items-center">
                Administradores <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{admins.length} activos</span>
              </h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {localAdmins.map((admin, idx) => {
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

    </div>
  );
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

function ShortcutCard({ title, desc, link, icon, color, delay, target }: any) {
  const isExternal = link.startsWith('http');
  
  const innerContent = (
    <>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300`}>
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-1 text-blue-950 group-hover:text-white transition-colors duration-300">{title}</h4>
      <p className="text-xs text-slate-500 leading-snug group-hover:text-blue-100 transition-colors duration-300">{desc}</p>
    </>
  );

  const containerClass = `block bg-white border border-slate-200 rounded-3xl p-5 hover:bg-blue-950 hover:border-blue-950 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300 group card-anim ${delay}`;

  if (isExternal) {
    return (
      <a href={link} target={target || "_blank"} rel="noopener noreferrer" className={containerClass}>
        {innerContent}
      </a>
    );
  }

  return (
    <Link href={link} target={target} className={containerClass}>
      {innerContent}
    </Link>
  );
}
