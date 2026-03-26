"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaUserCircle } from "react-icons/fa";
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
import Image from "next/image";

export function Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Inicio", link: "/#home" },
    { name: "Nosotros", link: "/#about" },
    { name: "Planes", link: "/#plans" },
    { name: "Sectores", link: "/#contact" },
    { name: "Portal Clientes", link: "https://avisos.wisphub.net/saldo/bcas-sas/" },
  ];

  return (
    <AnimatedNavbar className="z-9999" forceSolid={forceSolid}>
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

          {/* Admin favicon */}
          <Link 
            href="/admin"
            className="transition-colors text-white hover:text-blue-950"
          >
            <FaUserCircle className="size-5.5" />
          </Link>
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

          {/* Botones móviles */}
          <div className="flex w-full flex-col gap-4 mt-4">
            <Link href="/login" className="w-full text-center px-4 py-2 bg-blue-950 text-white rounded">
              Login
            </Link>
            <Link href="/book" className="w-full text-center px-4 py-2 bg-blue-950 text-white rounded">
              Book a call
            </Link>
            <Link href="/admin" className="w-full text-center px-4 py-2 bg-blue-950 text-white rounded">
              Admin
            </Link>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </AnimatedNavbar>
  );
}