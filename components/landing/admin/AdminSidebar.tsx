import Link from "next/link";
import { LayoutDashboard, Map, CreditCard, Video, Settings, ExternalLink, LogOut, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => { window.location.href = "/admin"; } }
    });
  };

  return (
    <>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar-anim hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-5 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2 select-none">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm p-1 border border-slate-100">
            <img src="/images/bcas-logo.png" alt="Bioconstructores Asociados SAS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-[13px] font-black leading-tight text-blue-950">Bioconstructores<br/><span className="text-blue-950 font-medium text-[10px] uppercase tracking-wider">Asociados SAS</span></h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem active={pathname === '/admin/dashboard'} icon={<LayoutDashboard size={20} />} label="Dashboard" href="/admin/dashboard" />
          <NavItem active={pathname === '/admin/admin-sectores'} icon={<Map size={20} />} label="Sectores" href="/admin/admin-sectores" />
          <NavItem active={pathname === '/admin/admin-plans'} icon={<CreditCard size={20} />} label="Planes" href="/admin/admin-plans" />
          <NavItem active={pathname === '/admin/admin-hero'} icon={<Video size={20} />} label="Hero Principal" href="/admin/admin-hero" />
          <NavItem active={pathname === '/admin/admin-policy'} icon={<Settings size={20} />} label="Políticas" href="/admin/admin-policy" />
          <NavItem icon={<ExternalLink size={20} />} label="Portal Clientes" href="https://avisos.wisphub.net/saldo/bcas-sas/" target="_blank" />
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

      {/* ── MOBILE NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-40 flex justify-around p-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <MobileNavItem icon={<LayoutDashboard size={20} />} label="Dash" href="/admin/dashboard" active={pathname === '/admin/dashboard'} />
        <MobileNavItem icon={<Map size={20} />} label="Sectores" href="/admin/admin-sectores" active={pathname === '/admin/admin-sectores'} />
        <MobileNavItem icon={<CreditCard size={20} />} label="Planes" href="/admin/admin-plans" active={pathname === '/admin/admin-plans'} />
        <MobileNavItem icon={<CheckCircle size={20} />} label="Políticas" href="/admin/admin-policy" active={pathname === '/admin/admin-policy'} />
        <MobileNavItem icon={<ExternalLink size={20} />} label="Portal" href="https://avisos.wisphub.net/saldo/bcas-sas/" target="_blank" />
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 p-2 text-red-500 hover:text-red-700 transition-colors">
          <LogOut size={20} />
          <span className="text-[10px] font-bold">Salir</span>
        </button>
      </nav>
    </>
  );
}

function MobileNavItem({ icon, label, href, active, target }: { icon: any, label: string, href: string, active?: boolean, target?: string }) {
  return (
    <Link href={href} target={target} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${active ? 'text-blue-950' : 'text-slate-400'}`}>
      <div className={`${active ? 'bg-blue-100 text-blue-900' : 'bg-transparent'} p-1.5 rounded-lg`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-blue-950' : 'text-slate-500'}`}>{label}</span>
    </Link>
  );
}

function NavItem({ icon, label, href, active, target }: { icon: any, label: string, href: string, active?: boolean, target?: string }) {
  return (
    <Link href={href} target={target} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm group
      ${active ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-950'}
    `}>
      <span className={active ? '' : 'group-hover:text-blue-950 transition-colors'}>{icon}</span>
      <span>{label}</span>
      {active && <motion.div layoutId="nav-marker" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>
  )
}
