"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  Navbar as AnimatedNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export function Navbar() {
  // esto pa controlar el menu de celular
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // esto pa definir los links del navbar
  const navItems = [
    { name: "Inicio", link: "#home" },
    { name: "Nosotros", link: "#about" },
    { name: "Planes", link: "#plans" },
    { name: "Sectores", link: "#contact" },
    {
      name: "Portal Clientes",
      link: "https://avisos.wisphub.net/saldo/bcas-sas/",
    },
  ];

  return (
    <AnimatedNavbar className="z-9999">
      {/* esto es el navbar de pc */}
      <NavBody>
        <NavbarLogo />

        {/* esto pa mandar los links y abrir portal clientes en otra pestaña */}
        <NavItems
          items={navItems.map((item) => ({
            ...item,
            target:
              item.name === "Portal Clientes" ? "_blank" : undefined,
            rel:
              item.name === "Portal Clientes"
                ? "noopener noreferrer"
                : undefined,
          }))}
        />

        <NavSocials />
      </NavBody>

      {/* esto es el navbar de celular */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {/* esto pa los links en celular */}
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              target={
                item.name === "Portal Clientes" ? "_blank" : "_self"
              }
              rel={
                item.name === "Portal Clientes"
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}

          {/* esto pa los botones de abajo */}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton className="w-full" variant="primary">
              Login
            </NavbarButton>
            <NavbarButton className="w-full" variant="primary">
              Book a call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </AnimatedNavbar>
  );
}

// esto pa los iconos de redes
function NavSocials({ visible }: { visible?: boolean }) {
  return (
    <div className="flex items-center gap-4 z-20">
      <Link
        href="https://www.facebook.com/people/Bioconstructores-Asociados/61576844756821/"
        target="_blank"
        className={cn(
          "transition-colors",
          visible ? "text-blue-950 font-bold" : "text-white"
        )}
      >
        <FaFacebook className="size-5.5" />
      </Link>

      <Link
        href="https://www.instagram.com/bcatelecomunicaciones"
        target="_blank"
        className={cn(
          "transition-colors",
          visible ? "text-blue-950 font-bold" : "text-white"
        )}
      >
        <FaInstagram className="size-5.5" />
      </Link>

      <Link
        href="https://api.whatsapp.com/send?phone=3202739134"
        target="_blank"
        className={cn(
          "transition-colors",
          visible ? "text-blue-950 font-bold" : "text-white"
        )}
      >
        <FaWhatsapp className="size-5.5" />
      </Link>
    </div>
  );
}