"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AdminHeader({ title }: { title?: string }) {
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

  return (
    <>
      <header className="header-anim sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 pl-14 md:pl-6 pr-6 py-4 flex items-center justify-between border-b border-slate-200/50 shadow-xs">
        <div className="flex items-center gap-3">
          {title && (
            <div>
              <h1 className="font-bold text-lg leading-none text-blue-950">{title}</h1>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center gap-3 hover:bg-white p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            {displayImage ? (
              <img src={displayImage} alt={displayName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-blue-950 font-bold shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-blue-950 leading-none">{displayName}</p>
            </div>
          </button>
        </div>
      </header>

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
    </>
  );
}
