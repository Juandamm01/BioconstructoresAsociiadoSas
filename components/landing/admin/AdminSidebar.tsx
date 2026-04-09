"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Map, CreditCard, Video, Settings, ExternalLink, LogOut, Menu, X, PanelLeft, Scale, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

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

  const router = useRouter();
  const { data: activeSession } = authClient.useSession();
  const currentUser = activeSession?.user;

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profileImage, setProfileImage] = useState(currentUser?.image || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileError, setProfileError] = useState("");
  
  const [displayImage, setDisplayImage] = useState(currentUser?.image);
  const [displayName, setDisplayName] = useState(currentUser?.name || "Admin");

  useEffect(() => {
    if (currentUser) {
      setDisplayImage(currentUser.image);
      setDisplayName(currentUser.name || "Admin");
    }
  }, [currentUser]);

  useEffect(() => {
    if (isEditingProfile) {
      setProfileName(displayName || "");
      setProfileImage(displayImage || "");
    }
  }, [isEditingProfile, displayName, displayImage]);

  const saveProfile = async () => {
    if (!currentUser) return;
    setSavingProfile(true);
    setProfileError("");
    
    let finalImageUrl = profileImage;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "profiles");
      formData.append("oldUrl", profileImage || "");
      
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadData.url;
          setProfileImage(finalImageUrl);
        } else {
          setProfileError(uploadData.error || "Error al subir la imagen.");
          setSavingProfile(false);
          return;
        }
      } catch (err) {
        setProfileError("Error de conexión al cargar la imagen.");
        setSavingProfile(false);
        return;
      }
    }

    await authClient.updateUser({
      name: profileName,
      image: finalImageUrl,
    });
    
    setDisplayImage(finalImageUrl);
    setDisplayName(profileName);
    
    setSavingProfile(false);
    setIsEditingProfile(false);
    setSelectedFile(null);
    
    router.refresh(); 
    setTimeout(() => {
      window.location.reload();
    }, 400); 
  };

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
        <NavItem collapsed={collapsed} active={pathname === '/admin/admin-policy'} icon={<CheckCircle size={20} />} label="Políticas" href="/admin/admin-policy" />
        <NavItem collapsed={collapsed} icon={<ExternalLink size={20} />} label="Portal Clientes" href="https://avisos.wisphub.net/saldo/bcas-sas/" target="_blank" />
      </nav>

      <div className={`mt-auto pt-4 border-t border-slate-100 pb-2 md:pb-0 flex flex-col gap-2 ${collapsed ? 'items-center' : ''}`}>
        
        <button 
          onClick={() => setIsEditingProfile(true)}
          title={collapsed ? "Editar Perfil" : undefined}
          className={`flex items-center gap-3 w-full px-2 py-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200 cursor-pointer ${collapsed ? 'justify-center px-0 w-auto' : ''}`}
        >
          {displayImage ? (
            <img src={displayImage} alt={displayName} className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" />
          ) : (
            <div className="w-9 h-9 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-blue-950 font-bold shadow-sm">
              {displayName?.charAt(0).toUpperCase()}
            </div>
          )}
          {!collapsed && (
            <div className="text-left min-w-0">
              <p className="text-sm font-bold text-blue-950 leading-none truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500 mt-1">Administrador</p>
            </div>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="md:hidden absolute top-[16px] left-4 z-[60] p-1 bg-blue-950 rounded-md shadow-sm border border-blue-900 text-white flex items-center justify-center hover:bg-blue-900 transition-all active:scale-95"
        >
          <Menu size={16} />
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

      <AnimatePresence>
        {isEditingProfile && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">Editar Mi Perfil</h3>
              
              {profileError && (
                <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
                  {profileError}
                </div>
              )}

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
                  
                  <div className="flex items-center gap-4 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                      {selectedFile ? (
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                      ) : profileImage ? (
                        <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-blue-950 font-black text-2xl">
                          {(profileName || "A").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-950">Vista Previa</p>
                      <p className="text-[10px] text-slate-500 mb-2">Así te verás en el panel.</p>
                      <button 
                        type="button"
                        onClick={() => {
                          setProfileImage("");
                          setSelectedFile(null);
                        }}
                        disabled={!profileImage && !selectedFile}
                        className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Quitar Imagen
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <div className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                        <Upload size={18} className="text-blue-500" />
                        <span className="text-sm font-semibold text-slate-600">
                          {selectedFile ? selectedFile.name : profileImage ? "Cambiar mi foto actual..." : "Seleccionar Fotografía..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleLogout} 
                    className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancelar</button>
                    <button onClick={saveProfile} disabled={savingProfile} className="px-4 py-2 text-sm font-bold bg-blue-950 text-white rounded-xl hover:bg-blue-900 disabled:opacity-50 flex items-center gap-2">
                      {savingProfile ? "Guardando..." : "Guardar Perfil"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
