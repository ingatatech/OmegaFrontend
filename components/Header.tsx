'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from 'next/image'
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faqs", label: "FAQs" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
      
     	{/* Logo */}
						<div className="flex items-center space-x-2">
							<Image src="/logo/1.jpeg" alt="Omega sir ltd" width={200} height={60}  className="h-16 sm:h-20 lg:h-20 w-auto" />
						</div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 sm:gap-8 text-primary font-medium text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-black transition relative ${pathname === link.href ? 'text-black font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
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
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <nav
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Mobile menu"
      >
        <ul className="flex flex-col gap-6 p-8 text-primary font-medium text-lg">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              className={`transition-all duration-300 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            >
              <Link
                href={link.href}
                className={`block hover:text-black transition relative ${pathname === link.href ? 'text-black font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
} 