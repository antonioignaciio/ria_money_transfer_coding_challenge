"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "#", label: "Inicio", isActive: true },
  { href: "#", label: "Enviar Dinero", isActive: false },
  { href: "#", label: "Tasas de Cambio", isActive: false },
  { href: "#", label: "Ayuda", isActive: false },
] as const;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="w-full border-b-2 border-gray-200" style={{ backgroundColor: '#F6F6F6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-black">Ria Money Transfer Coding Challenge</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Navegación principal">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`transition-colors ${
                    link.isActive
                      ? "text-black font-semibold"
                      : "text-gray-700 font-medium"
                  } hover:text-orange-500`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-black hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded p-1"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-gray-200">
          <nav className="px-2 pt-2 pb-3 space-y-1" aria-label="Navegación móvil">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`block px-3 py-2 rounded-md hover:bg-orange-50 ${
                  link.isActive
                    ? "text-black font-semibold"
                    : "text-gray-700 font-medium"
                }`}
                onClick={toggleMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </nav>
  );
}

