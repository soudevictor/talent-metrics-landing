"use client";

import { NavCtaButtons } from "@/components/landing/landing-cta-buttons";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const NAV_LINKS = [
  { label: "Recursos", href: "#features" },
  { label: "Playground IA", href: "/playground", isInternal: true },
  { label: "Planos", href: "#pricing" },
  { label: "Depoimentos", href: "#testimonials" },
] as const;

function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Trap focus
    drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.nav
            key="mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed top-0 right-0 h-full w-72 bg-canvas border-l border-border-subtle z-50 flex flex-col pt-6 pb-8 px-6 md:hidden"
          >
            {/* Close button */}
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar menu"
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Links */}
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {"isInternal" in link ? (
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-auto border-t border-border-subtle pt-6">
              <NavCtaButtons />
            </div>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b border-border-subtle bg-canvas/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="TalentMetrics"
            width={140}
            height={64}
            style={{ width: 140, height: "auto" }}
            priority
          />

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm text-text-muted font-medium"
            aria-label="Navegação principal"
          >
            {NAV_LINKS.map((link) =>
              "isInternal" in link ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <NavCtaButtons />
            </div>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label="Abrir menu de navegação"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div id="mobile-nav-drawer">
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
    </>
  );
}
