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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Inicio",
      link: "#home",
    },
    {
      name: "Nosotros",
      link: "#about",
    },
    {
      name: "Planes",
      link: "#plans",
    },
    {
      name: "Sectores",
      link: "#contact",
    },
    {
      name: "Portal Clientes",
      link: "https://avisos.wisphub.net/saldo/bcas-sas/",
    },
  ];

  return (
    <AnimatedNavbar className="z-9999">
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems
          items={navItems.map((item) => ({
            ...item,
            link: item.link,
            target: item.name === "Portal Clientes" ? "_blank" : "_self",
          }))}
        />
        <NavSocials visible={false} /> {/* La prop 'visible' será inyectada por NavBody */}
      </NavBody>

      {/* Mobile Navigation */}
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
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
              target={item.name === "Portal Clientes" ? "_blank" : "_self"}
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Book a call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </AnimatedNavbar>
  );
}

function NavSocials({ visible }: { visible?: boolean }) {
  return (
    <div className="flex items-center gap-4 z-20">
      <Link
        href="https://www.facebook.com/people/Bioconstructores-Asociados/61576844756821/"
        className={cn(
          "cursor-pointer transition-colors duration-200",
          visible ? "text-blue-950 font-bold" : "text-white"
        )}
        target="_blank"
      >
        <FaFacebook className="size-5.75" />
      </Link>
      <Link
        href="https://www.instagram.com/bcatelecomunicaciones"
        className={cn(
          "cursor-pointer transition-colors duration-200",
          visible ? "text-blue-950 font-bold" : "text-white"
        )}
        target="_blank"
      >
        <FaInstagram className="size-5.75" />
      </Link>
      <Link
        href="https://api.whatsapp.com/send?phone=3202739134"
        className={cn(
          "cursor-pointer transition-colors duration-200",
          visible ? "text-blue-950 font-bold" : "text-white"
        )}
        target="_blank"
      >
        <FaWhatsapp className="size-5.75" />
      </Link>
    </div>
  );
}