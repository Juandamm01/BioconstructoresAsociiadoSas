"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import React, { useRef, useState, ReactElement, isValidElement } from "react";
import Link from "next/link";
import Image from "next/image";

// Tipos
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  forceSolid?: boolean;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    target?: string;
    rel?: string;
  }[];
  className?: string;
  onItemClick?: () => void;
  visible?: boolean;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
}

// Componente Navbar principal
export const Navbar = ({ children, className, forceSolid = false }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [visible, setVisible] = useState(forceSolid);

  useMotionValueEvent(scrollY, "change", (latest) => setVisible(forceSolid || latest > 100));

  // Filtra solo tus propios componentes para pasar visible
  const filteredChildren = React.Children.map(children, (child) => {
    if (isValidElement(child) && typeof child.type !== "string") {
      return React.cloneElement(child as ReactElement<any>, { visible });
    }
    return child;
  });

  return <motion.div ref={ref} className={cn("fixed inset-x-0 top-4 z-40 w-full", className)}>{filteredChildren}</motion.div>;
};

// NavBody
export const NavBody = ({ children, className, visible }: NavBodyProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible ? "0 0 24px rgba(34,42,53,0.06)" : "none",
      width: visible ? "60%" : "100%",
      y: visible ? 5 : 0,
    }}
    transition={{ type: "spring", stiffness: 200, damping: 50 }}
    className={cn(
      "relative mx-auto hidden w-full max-w-7xl flex-row items-center justify-between rounded-full px-4 py-0.5 lg:flex",
      visible && "bg-slate-200/60 backdrop-blur-md border border-white/20",
      className
    )}
    style={{ minWidth: "800px" }}
  >
    {React.Children.map(children, (child) =>
      isValidElement(child) && typeof child.type !== "string"
        ? React.cloneElement(child as ReactElement<any>, { visible })
        : child
    )}
  </motion.div>
);

// NavItems
export const NavItems = ({ items, className, onItemClick, visible }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith("/#") || link.startsWith("#")) {
      const hash = link.split("#")[1];
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          let top = element.getBoundingClientRect().top + window.scrollY;
          if (hash === "plans") {
            // plans.tsx pins at center center for 1000px
            top += window.innerHeight / 2 + 1000;
          } else if (hash === "contact") {
            // map.tsx pins at top top for 500px
            top += 500;
          }
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    }
    if (onItemClick) onItemClick();
  };

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn("absolute inset-0 hidden flex-1 items-center justify-center space-x-2 lg:flex", className)}
    >
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          target={item.target}
          rel={item.rel}
          onMouseEnter={() => setHovered(idx)}
          onClick={(e) => handleLinkClick(e, item.link)}
          className={cn("relative px-3 py-1.5 text-sm transition", visible ? "text-blue-950 font-medium" : "text-white")}
        >
          {hovered === idx && <motion.div layoutId="hovered" className="absolute inset-0 rounded-full bg-white/10" />}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

// Mobile
export const MobileNav = ({ children, className }: MobileNavProps) => <div className={cn("lg:hidden", className)}>{children}</div>;
export const MobileNavHeader = ({ children }: MobileNavHeaderProps) => <div className="flex justify-between w-full">{children}</div>;
export const MobileNavMenu = ({ children, isOpen }: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && <motion.div className="absolute top-16 w-full bg-white p-6">{children}</motion.div>}
  </AnimatePresence>
);
export const MobileNavToggle = ({ isOpen, onClick }: any) => (isOpen ? <IconX onClick={onClick} /> : <IconMenu2 onClick={onClick} />);

// Logo y botones
export const NavbarLogo = ({ visible }: { visible?: boolean }) => (
  <Link href="#">
    <Image src={visible ? "/images/bcas-logo.png" : "/images/Logo_BCAS_MODO_OSCURO.png"} alt="logo" width={40} height={40} />
  </Link>
);
export const NavbarButton = ({ children, ...props }: any) => <a {...props}>{children}</a>;