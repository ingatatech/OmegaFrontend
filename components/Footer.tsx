'use client';

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const quickLinks1 = [
  { href: "/", label: "Home" },
  { href: "/services", label: " Our Services" },
  { href: "/projects", label: " Our Projects" },
    { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];


export default function Footer() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className={`w-full bg-primary text-white pt-0 pb-0 top-0 relative overflow-hidden transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
 
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10 py-3">
        {/* Logo & Description - Takes 5 columns */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <p className="text-gray-100 text-base max-w-md">OMEGA SIR Ltd is a multi-service company specializing in Construction, Building Maintenance, Interior Design, Projection Workshop, Property Management & Cleaning services. We deliver outstanding solutions and build lasting relationships with our clients.</p>
          <div className="flex gap-4 mt-2">
            <Link href="https://www.facebook.com/omegasirrwanda/" className="hover:opacity-80 transition" aria-label="Facebook">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H6v4h4v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </Link>
            <Link href="https://cd.linkedin.com/company/omegasirrwanda" className="hover:opacity-80 transition" aria-label="LinkedIn">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </Link>
            <Link href="https://www.instagram.com/omegasirrwanda/?hl=en" className="hover:opacity-80 transition" aria-label="Instagram">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
            </Link>
          </div>
        </div>
        
        {/* Quick Links - Takes 3 columns (smaller) */}
        <div className="md:col-span-3 flex flex-col gap-2">
            <div className="font-semibold mb-2 text-lg">Quick Links</div>
            <ul className="flex flex-col gap-2 text-sm">
              {quickLinks1.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gray-300 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
        </div>
        
        {/* Contact Info - Takes 4 columns */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <div className="font-semibold mb-2 text-lg">Contact Us</div>
          <ul className="text-gray-100 text-base flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <MapPin/>
              Triumph house kimironko, Kigali City, Rwanda
            </li>
            <li className="flex items-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.08a2 2 0 0 1 .89-1.68l7-4.2a2 2 0 0 1 2.22 0l7 4.2a2 2 0 0 1 .89 1.68z"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <a href="tel:+250788303061" className="hover:text-white transition">+250 788 303 061</a>
            </li>
            <li className="flex items-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8.5"/><path d="M3.27 6.96 12 13l8.73-6.04A2 2 0 0 0 19.5 5h-15A2 2 0 0 0 3.27 6.96z"/></svg>
              <a href="mailto:info@omegasir.com" className="hover:text-white transition">info@omegasir.com</a>
            </li>
          </ul>
        </div>
    </div>
      {/* Bottom Bar */}
      <div className="w-full bg-primary/90 border-t border-white/10 py-4 text-center text-gray-200 text-xs flex flex-col md:flex-row items-center justify-between gap-2 px-4">
        <span>&copy; {new Date().getFullYear()} OMEGA SIR Ltd. All rights reserved.</span>
        <span>
          Developed in <span className="font-semibold text-white">The Ingata Technologies Ltd</span>
        </span>
        <span className="flex gap-4">
          <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition">Terms & Conditions</Link>
        </span>
      </div>
    </footer>
  );
} 