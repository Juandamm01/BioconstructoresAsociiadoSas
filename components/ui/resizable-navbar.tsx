"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
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
    target?: string; // ✅ NUEVO
    rel?: string;    // ✅ NUEVO
  }[];
  className?: string;
  onItemClick?: () => void;
  visible?: boolean;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-4 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { visible })
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34,42,53,0.06)"
          : "none",
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
        React.isValidElement(child)
          ? React.cloneElement(child as any, { visible })
          : child
      )}
    </motion.div>
  );
};

export const NavItems = ({
  items,
  className,
  onItemClick,
  visible,
}: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 items-center justify-center space-x-2 lg:flex",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          target={item.target} 
          rel={item.rel}       
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn(
            "relative px-3 py-1.5 text-sm transition",
            visible ? "text-blue-950 font-medium" : "text-white"
          )}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 rounded-full bg-white/10"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

/* --- TODO LO DEMÁS IGUAL --- */

export const MobileNav = ({ children, className, visible }: MobileNavProps) => (
  <div className={cn("lg:hidden", className)}>{children}</div>
);

export const MobileNavHeader = ({ children }: MobileNavHeaderProps) => (
  <div className="flex justify-between w-full">{children}</div>
);

export const MobileNavMenu = ({
  children,
  isOpen,
}: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div className="absolute top-16 w-full bg-white p-6">
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({ isOpen, onClick }: any) =>
  isOpen ? <IconX onClick={onClick} /> : <IconMenu2 onClick={onClick} />;

export const NavbarLogo = ({ visible }: { visible?: boolean }) => (
  <Link href="#">
    <Image
      src={visible ? "/images/bcas-logo.png" : "/images/Logo_BCAS_MODO_OSCURO.png"}
      alt="logo"
      width={40}
      height={40}
    />
  </Link>
);

export const NavbarButton = ({ children, ...props }: any) => (
  <a {...props}>{children}</a>
);