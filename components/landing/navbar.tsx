"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaWhatsapp, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import {
  Navbar as AnimatedNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { authClient } from "@/lib/auth-client";

export function Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Hook de better-auth para saber si hay un usuario conectado
  const { data: session } = authClient.useSession();

  const navItems = [
    { name: "Inicio", link: "/#home" },
    { name: "Nosotros", link: "/#about" },
    { name: "Planes", link: "/#plans" },
    { name: "Sectores", link: "/#contact" },
    { name: "Portal Clientes", link: "https://avisos.wisphub.net/saldo/bcas-sas/" },
  ];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin");
        },
      },
    });
  };

  return (
    <AnimatedNavbar className="z-[9999]" forceSolid={forceSolid}>
      {/* Navbar Desktop */}
      <NavBody>
        <NavbarLogo />

        <NavItems
          items={navItems.map((item) => ({
            ...item,
            target: item.name === "Portal Clientes" ? "_blank" : undefined,
            rel: item.name === "Portal Clientes" ? "noopener noreferrer" : undefined,
          }))}
        />

        {/* Redes sociales + Admin logo */}
        <div className="flex items-center gap-4 z-20">
          <Link
            href="https://www.facebook.com/people/Bioconstructores-Asociados/61576844756821/"
            target="_blank"
            className="transition-colors text-white hover:text-blue-950"
          >
            <FaFacebook className="size-5.5" />
          </Link>

          <Link
            href="https://www.instagram.com/bcatelecomunicaciones"
            target="_blank"
            className="transition-colors text-white hover:text-blue-950"
          >
            <FaInstagram className="size-5.5" />
          </Link>

          <Link
            href="https://api.whatsapp.com/send?phone=3202739134"
            target="_blank"
            className="transition-colors text-white hover:text-blue-950"
          >
            <FaWhatsapp className="size-5.5" />
          </Link>

          {/* Admin auth render condicional */}
          {session ? (
            <button 
              onClick={handleLogout}
              title="Cerrar sesión"
              className="transition-colors text-white hover:text-red-500 cursor-pointer"
            >
              <FaSignOutAlt className="size-5.5" />
            </button>
          ) : (
            <Link 
              href="/admin"
              title="Ingreso Administrador"
              className="transition-colors text-white hover:text-blue-950"
            >
              <FaUserCircle className="size-5.5" />
            </Link>
          )}
        </div>
      </NavBody>

      {/* Navbar Móvil */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen}>
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              target={item.name === "Portal Clientes" ? "_blank" : "_self"}
              rel={item.name === "Portal Clientes" ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (item.link.startsWith("/#") || item.link.startsWith("#")) {
                  const hash = item.link.split("#")[1];
                  if (typeof window !== "undefined" && window.location.pathname === "/") {
                    e.preventDefault();
                    const element = document.getElementById(hash);
                    if (element) {
                      let top = element.getBoundingClientRect().top + window.scrollY;
                      if (hash === "plans") {
                        top += window.innerHeight / 2 + 1000;
                      } else if (hash === "contact") {
                        top += 500;
                      }
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }
                }
                setIsMobileMenuOpen(false);
              }}
              className="relative text-neutral-600 dark:text-neutral-300 block py-2"
            >
              {item.name}
            </a>
          ))}

          {/* Botones móviles condicionales */}
          <div className="flex w-full flex-col gap-4 mt-4">
            {session ? (
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }} 
                className="w-full text-center px-4 py-2 bg-red-600 text-white rounded font-bold"
              >
                Cerrar sesión ({session.user.name})
              </button>
            ) : (
              <Link 
                href="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 bg-blue-950 text-white rounded"
              >
                Admin
              </Link>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </AnimatedNavbar>
  );
}