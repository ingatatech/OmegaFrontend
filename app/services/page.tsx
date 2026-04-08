"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Building,
  Wrench,
  Sparkles,
  Paintbrush,
  Factory,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import VideoBackground from "@/components/video-background";
import { motion } from "framer-motion";
import  ScrollProgress  from "@/components/ui/ScrollProgress";

// Simple particles background (canvas-based, no dependency)
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 2 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
      color: `rgba(59,130,246,${0.15 + Math.random() * 0.2})`,
    }));
    let animationId: number;
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      animationId = requestAnimationFrame(animate);
    }
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      animate();
    }
    return () => cancelAnimationFrame(animationId);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
    />
  );
}

const services = [
  {
    id: "construction",
    icon: Building,
    title: "Construction Projects",
    description:
      "Residential & commercial building construction, renovations, and project management.",
    items: [
      "Residential & commercial building construction",
      "Renovations & extensions",
      "Project management & consultancy",
    ],
    cta: "Request Construction Quote",
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Building Maintenance",
    description:
      "Preventive and corrective maintenance for all building systems.",
    items: [
      "Preventive & corrective maintenance",
      "Electrical and plumbing services",
      "HVAC system servicing",
      "Facility inspections and repairs",
    ],
    cta: "Book Maintenance Service",
  },
  {
    id: "cleaning",
    icon: Sparkles,
    title: "Cleaning Services",
    description:
      "Comprehensive cleaning for homes, offices, and post-construction.",
    items: [
      "General cleaning (residential & commercial)",
      "Deep cleaning and sanitization",
      "Post-construction cleanup",
      "Janitorial services",
    ],
    cta: "Schedule Cleaning",
  },
  {
    id: "interior",
    icon: Paintbrush,
    title: "Interior Design",
    description: "Creative and functional interior design solutions.",
    items: [
      "Space planning and layout",
      "Custom design concepts",
      "Furniture and décor selection",
      "Turnkey interior solutions",
    ],
    cta: "Start Interior Project",
  },
  {
    id: "workshop",
    icon: Factory,
    title: "Projection Workshop",
    description: "Custom furniture, fabrication, and bespoke installations.",
    items: [
      "Custom furniture manufacturing",
      "Wood, metal, and glass fabrication",
      "Signage and branding elements",
      "Bespoke installations for interiors and exteriors",
    ],
    cta: "Request Workshop Quote",
  },
  {
    id: "property",
    icon: ClipboardList,
    title: "Property Management",
    description:
      "Professional management for residential and commercial properties.",
    items: [
      "Tenant screening and leasing",
      "Rent collection and accounting",
      "Property inspections and maintenance coordination",
      "Legal compliance and documentation",
      "Asset performance reporting",
    ],
    cta: "Contact Property Manager",
  },
];

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
    useEffect(() => {
    const timer = setTimeout(() => {
      scrollToServices()
    }, 1500) // Delay of 1.5 seconds to allow hero section to be viewed briefly
    
    return () => clearTimeout(timer)
  }, [])
  const scrollToServices = () => {
        const servicesSection = document.getElementById('services')
        if (servicesSection) {
          servicesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
  return (
    <>
      <VideoBackground />
      <ScrollProgress />
      <main className="min-h-screen relative overflow-x-hidden">
        <ParticlesBackground />
        {/* <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white overflow-hidden z-10"> */}
        <section className="relative inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95 text-white overflow-hidden z-10">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl  font-bold mb-6 font-title text-left"
            >
              OMEGA SIR Ltd, Your{" "}
              <span className="text-orange-300">Service Partner</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl mb-6 max-w-6xl mx-auto font-body text-left"
            >
              Comprehensive solutions for{" "}
              <span className="font-bold text-white">construction</span>,{" "}
              <span className="font-bold text-white">maintenance</span>,{" "}
              <span className="font-bold text-white">cleaning</span>,{" "}
              <span className="font-bold text-white">design</span>,{" "}
              <span className="font-bold text-white">production</span>, and{" "}
              <span className="font-bold text-white">property management</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-white max-w-6xl mx-auto mb- text-left"
            >
              <p>
                We deliver end-to-end solutions for every stage of your property
                or business journey. Our expert team ensures quality,
                reliability, and innovation in every project big or small.
              </p>
            </motion.div>

            {/* Scroll Down Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.5,
                type: "spring",
                stiffness: 300,
              }}
              className="mt-8 inline-block"
            >
              <button className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all duration-300">
          
                <a href="#services">
      <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>

                </a>
              </button>
            </motion.div>
          </div>

       
        </section>
        <section id="services" className="max-w-7xl mx-auto px-4 py-5 bg-gray-100 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isHovered = hoveredService === service.id;
              return (
                <div
                  key={service.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    isHovered ? "scale-105 z-20" : ""
                  }`}
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`rounded-xl shadow-lg border border-gray-100 p-6 h-full transition-all duration-500 ${
                      isHovered
                        ? "bg-primary text-white shadow-2xl border-primary/40"
                        : "bg-white text-gray-900 hover:shadow-xl"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 ${
                        isHovered
                          ? "bg-white/10 text-white"
                          : "bg-gradient-to-br from-primary/10 to-primary/20 text-primary"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 transition-all duration-500 ${
                          isHovered ? "text-white" : "text-primary"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                        isHovered ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mb-4 text-sm leading-relaxed transition-colors duration-500 ${
                        isHovered ? "text-blue-100/90" : "text-gray-600"
                      }`}
                    >
                      {service.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {service.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center text-sm transition-colors duration-500 ${
                            isHovered ? "text-blue-100/90" : "text-gray-700"
                          }`}
                        >
                          <CheckCircle
                            className={`w-4 h-4 mr-2 opacity-70 transition-colors duration-500 ${
                              isHovered ? "text-white" : "text-primary"
                            }`}
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        {/* Project CTA Section */}
        <section className="relative w-full min-h-[220px] flex items-center justify-center overflow-hidden">
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 z-0">
            {/* <img src="/images/project1-after.jpg" alt="Contact background" className="w-full h-full object-cover object-center" /> */}

            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 py-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 drop-shadow-lg">
              Ready to Get Started?
            </h2>
            <p className="text-sm sm:text-base text-gray-100 mb-5 max-w-2xl mx-auto drop-shadow">
              Contact us today for a free consultation and personalized quote
              for your project.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary font-bold text-base px-6 py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition border-2 border-white"
            >
              Contact Us Today
            </a>
          </div>
          {/* Bottom wave */}
          <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
            <svg
              viewBox="0 0 1920 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-10 md:h-14"
            >
              <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#1760b0" />
            </svg>
          </div>
        </section>
      </main>
    </>
  );
}
