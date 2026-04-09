"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Map, CreditCard, Video, Settings, ExternalLink, LogOut, Menu, X, PanelLeft, Scale } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bcas_sidebar_collapsed") === "true";
    }
    return false;
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("bcas_sidebar_collapsed", String(newState));
      return newState;
    });
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => { window.location.href = "/admin"; } }
    });
  };

  const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => (
    <>
      <div className={`flex items-center gap-3 mb-10 select-none ${collapsed ? 'justify-center px-0' : 'px-2'}`}>
        <div className={`rounded-xl bg-white flex items-center justify-center shadow-sm p-1 border border-slate-100 shrink-0 ${collapsed ? 'w-10 h-10' : 'w-10 h-10'}`}>
          <img src="/images/bcas-logo.png" alt="Bioconstructores Asociados SAS Logo" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-[13px] font-black leading-tight text-blue-950">Bioconstructores<br/><span className="text-blue-950 font-medium text-[10px] uppercase tracking-wider">Asociados SAS</span></h1>
          </div>
        )}
        {!collapsed && (
          <button className="md:hidden ml-auto text-slate-400 hover:text-red-500 transition-colors p-1" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav className={`flex-1 space-y-1 overflow-y-auto custom-scrollbar ${collapsed ? 'pr-0' : 'pr-2'}`}>
        <NavItem collapsed={collapsed} active={pathname === '/admin/dashboard'} icon={<LayoutDashboard size={20} />} label="Dashboard" href="/admin/dashboard" />
        <NavItem collapsed={collapsed} active={pathname === '/admin/admin-sectores'} icon={<Map size={20} />} label="Sectores" href="/admin/admin-sectores" />
        <NavItem collapsed={collapsed} active={pathname === '/admin/admin-plans'} icon={<CreditCard size={20} />} label="Planes" href="/admin/admin-plans" />
        <NavItem collapsed={collapsed} active={pathname === '/admin/admin-hero'} icon={<Video size={20} />} label="Hero Principal" href="/admin/admin-hero" />
        <NavItem collapsed={collapsed} active={pathname === '/admin/admin-policy'} icon={<Scale size={20} />} label="Políticas" href="/admin/admin-policy" />
        <NavItem collapsed={collapsed} icon={<ExternalLink size={20} />} label="Portal Clientes" href="https://avisos.wisphub.net/saldo/bcas-sas/" target="_blank" />
      </nav>

      <div className={`mt-auto pt-4 border-t border-slate-100 pb-2 md:pb-0 ${collapsed ? 'flex justify-center' : ''}`}>
        <button 
          onClick={handleLogout}
          title={collapsed ? "Salir de sesión" : undefined}
          className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group ${collapsed ? 'justify-center px-0 w-auto' : ''}`}
        >
          <LogOut size={20} className={!collapsed ? 'group-hover:-translate-x-1 transition-transform' : ''} /> 
          {!collapsed && "Salir de sesión"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="md:hidden absolute top-[24px] left-4 z-[60] p-1 bg-blue-950 rounded-lg shadow-sm border border-blue-900 text-white flex items-center justify-center hover:bg-blue-900 transition-all active:scale-95"
        >
          <Menu size={18} />
        </button>
      )}

      <aside className={`sidebar-anim hidden md:flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 transition-all duration-300 relative ${isCollapsed ? 'w-[80px] p-4 px-3' : 'w-64 p-5'}`}>
        <button 
          onClick={handleToggleCollapse}
          className="absolute -right-3.5 top-6 bg-white border border-slate-200 shadow-sm rounded-full w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-950 hover:border-blue-300 transition-all z-50 hover:scale-105"
        >
          <PanelLeft size={14} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40]"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 left-0 h-[100dvh] w-[280px] bg-white z-[50] p-5 flex flex-col shadow-2xl overflow-hidden"
            >
              <SidebarContent collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ icon, label, href, active, target, collapsed }: any) {
  return (
    <Link href={href} target={target} title={collapsed ? label : undefined} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm group
      ${active ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-950'}
      ${collapsed ? 'justify-center px-0' : ''}
    `}>
      <span className={active ? '' : 'group-hover:text-blue-950 transition-colors'}>{icon}</span>
      {!collapsed && <span>{label}</span>}
      {active && !collapsed && <motion.div layoutId="nav-marker" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>
  )
}
