"use client"

import ScrollProgress from "@/components/ui/ScrollProgress"
import VideoBackground from "@/components/video-background"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { fetchProjects, fetchTestimonials } from "@/lib/api"
import type { Partners, Project, Testimonial } from "@/lib/types"
import api from "@/lib/axios"

function AnimatedCounter({
  end,
  duration = 2000,
  className = "",
}: {
  end: number
  duration?: number
  className?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let start = 0
    const increment = end / (duration / 16)
    function update() {
      start += increment
      if (start < end) {
        setCount(Math.floor(start))
        ref.current = setTimeout(update, 16)
      } else {
        setCount(end)
      }
    }
    update()
    return () => {
      if (ref.current) clearTimeout(ref.current)
    }
  }, [end, duration])

  return <span className={className}>{count.toLocaleString()}</span>
}

function getInitials(name: string) {
  return name ? name.trim().charAt(0).toUpperCase() : "?"
}


import { Building2, Wrench, Sparkles, Factory, ClipboardList, SprayCan } from "lucide-react"

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [partners, setPartners] = useState<Partners[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
const currentYear = new Date().getFullYear();
const yearsExperience = currentYear - 2014 + 1;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch projects and testimonials in parallel
        const [projectsData, testimonialsData,partnersData] = await Promise.all([
          fetchProjects(),
          fetchTestimonials(),
          api.get("/partners")
        ])

        setProjects(projectsData.slice(0, 3)) // Show only first 3 projects
        
        // Filter approved testimonials only
        const approvedTestimonials = testimonialsData.data?.filter((t: Testimonial) => t.approved) || []
        setTestimonials(approvedTestimonials.slice(0, 4)) // Show only first 4 testimonials

           // Set partners data
        setPartners(partnersData.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentTestimonial, testimonials.length])

  // Helper function to strip HTML tags
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  return (
    <>
      <ScrollProgress />
      <VideoBackground />
      <div className="min-h-screen text-white flex flex-col">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 py-12 bg-gradient-to-br from-primary/90 via-primary/50 to-white/95 text-white overflow-hidden z-10 lg:-mt-10">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10 z-0" />

          {/* Content */}
          <div className="text-left max-w-6xl mx-auto space-y-10">
            	{/* Badge */}
						<motion.div 
							className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-primary/50 shadow-xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<motion.div 
								className="w-2.5 h-2.5 bg-primary rounded-full"
								animate={{ 
									scale: [1, 1.4, 1],
									boxShadow: ["0 0 0 0 rgba(1, 139, 202, 0.4)", "0 0 0 8px rgba(1, 139, 202, 0)", "0 0 0 0 rgba(1, 139, 202, 0)"]
								}}
								transition={{ duration: 2, repeat: Infinity }}
							/>
							<span className="text-sm font-semibold text-white"> Rwanda&apos;s Premier Construction & Facilities Company</span>
						</motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-bold mb-4 text-left"
            >
              Building Excellence, Delivering Solutions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className=" mb-8 text-2xl font-medium text-blue-100 text-left"
            >
              Your trusted partner for Construction, Building Maintenance, Interior Design, Projection Workshop,
              Property Management & Cleaning services
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center mb-8"
            >
              <Link
                href="/contact"
                className="bg-white text-primary font-bold py-3 px-8 text-center rounded-full shadow hover:bg-gray-100 transition w-fit"
              >
                Get Free Quote
              </Link>
              <Link
                href="/services"
                className="border-2 border-white text-white font-bold py-3 px-8 text-center rounded-full hover:bg-white hover:text-primary transition w-fit"
              >
                View Our Services
              </Link>
            </motion.div>
          </div>

        </section>

        {/* Services Overview Section */}
        <section id="services" className="w-full bg-white text-primary py-16 px-4 animate-fade-in-up">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Complete Solutions Under One Roof</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Construction Projects */}
              <div className="flex flex-col items-center bg-primary/5 rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-105 duration-300">
                <div className="bg-primary rounded-full p-4 mb-4 animate-bounce-slow text-white">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Construction Projects</h3>
                <p className="text-center mb-4 text-gray-700">
                  Residential & commercial building construction, renovations, and project management
                </p>
                <Link
                  href="/services"
                  className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition"
                >
                  Learn More
                </Link>
              </div>
              {/* Building Maintenance */}
              <div className="flex flex-col items-center bg-primary/5 rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-105 duration-300">
                <div className="bg-primary rounded-full p-4 mb-4 animate-bounce-slow text-white">
                  <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Building Maintenance</h3>
                <p className="text-center mb-4 text-gray-700">
                  Preventive and corrective maintenance for all building systems
                </p>
                <Link
                  href="/contact"
                  className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition"
                >
                  Book Service
                </Link>
              </div>
              {/* Cleaning Services */}
              <div className="flex flex-col items-center bg-primary/5 rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-105 duration-300">
                <div className="bg-primary rounded-full p-4 mb-4 animate-bounce-slow text-white">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cleaning Services</h3>
                <p className="text-center mb-4 text-gray-700">
                  Comprehensive cleaning for homes, offices, and post-construction
                </p>
                <Link
                  href="/contact"
                  className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition"
                >
                  Schedule Now
                </Link>
              </div>
              {/* Interior Design */}
              <div className="flex flex-col items-center bg-primary/5 rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-105 duration-300">
                <div className="bg-primary rounded-full p-4 mb-4 animate-bounce-slow text-white">
                 <SprayCan className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interior Design</h3>
                <p className="text-center mb-4 text-gray-700">Creative and functional interior design solutions</p>
                <Link
                  href="/contact"
                  className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition"
                >
                  Start Project
                </Link>
              </div>
              {/* Projection Workshop */}
              <div className="flex flex-col items-center bg-primary/5 rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-105 duration-300">
                <div className="bg-primary rounded-full p-4 mb-4 animate-bounce-slow text-white">
                  <Factory className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Projection Workshop</h3>
                <p className="text-center mb-4 text-gray-700">Custom furniture, fabrication, and bespoke installations</p>
                <Link
                  href="/contact"
                  className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition"
                >
                  Get Quote
                </Link>
              </div>
              {/* Property Management */}
              <div className="flex flex-col items-center bg-primary/5 rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-105 duration-300">
                <div className="bg-primary rounded-full p-4 mb-4 animate-bounce-slow text-white">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Property Management</h3>
                <p className="text-center mb-4 text-gray-700">
                  Professional management for residential and commercial properties
                </p>
                <Link
                  href="/contact"
                  className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-gray-900 transition"
                >
                  Contact Manager
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics/Achievements Section */}
        <section className="w-full py-10 px-4 bg-gradient-to-r from-primary via-gray-400/10 to-primary text-white animate-fade-in-up">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">
                <AnimatedCounter end={projects.length > 0 ? projects.length  : 500} />+
              </span>
              <span className="text-lg font-medium text-gray-200">Projects Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">
                <AnimatedCounter end={yearsExperience} />+
              </span>
              <span className="text-lg font-medium text-gray-200">Years' Experience</span>
            </div>
         
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">
                <AnimatedCounter end={24} />
                /7
              </span>
              <span className="text-lg font-medium text-gray-200">Support Available</span>
            </div>
          </div>
        </section>

        {/* Recent Projects Showcase */}
        <section className="w-full bg-white text-primary py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Latest Success Projects</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
              {/* this was for when we have before and agter images */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col">
                      <div className="relative w-full h-48 mb-4 group overflow-hidden rounded-t-xl">
                
                        <span className="absolute top-2 left-2 z-10 px-3 py-1 text-xs font-bold rounded-full bg-black/70 text-white group-hover:opacity-0 transition-opacity duration-300">
                          Before
                        </span>
                   
                        <span className="absolute top-2 right-2 z-10 px-3 py-1 text-xs font-bold rounded-full bg-primary text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          After
                        </span>
                        <img
                          src={project.imageBefore || "/placeholder.svg"}
                          alt="Before"
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                        />
                        <img
                          src={project.imageAfter || "/placeholder.svg"}
                          alt="After"
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        />
                      </div>
                      <div className="px-4 pb-4 flex-1 flex flex-col">
                        <div className="font-semibold text-lg mb-1">{project.name}</div>
                        <div className="text-sm text-gray-500 mb-2">{project.location}</div>
                        <p className="text-gray-700 mb-2 flex-grow">
                          {truncateText(stripHtml(project.description), 120)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-block text-xs bg-primary text-white rounded px-2 py-1">
                            {project.category.name}
                          </span>
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-primary hover:text-primary/80 text-sm font-semibold"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
  {projects.map((project) => (
    <div
      key={project.id}
      className="bg-white rounded-xl shadow hover:shadow-lg transition hover:scale-105 duration-300 flex flex-col"
    >
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-t-xl">
        {/* Always show After label */}
        {/* <span className="absolute top-2 right-2 z-10 px-3 py-1 text-xs font-bold rounded-full bg-primary text-white">
          After
        </span> */}

        {/* Display ONLY the after image */}
        <img
          src={project.imageAfter || "/placeholder.svg"}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="px-4 pb-4 flex-1 flex flex-col">
        <div className="font-semibold text-lg mb-1">{project.name}</div>
        <div className="text-sm text-gray-500 mb-2">{project.location}</div>
        <p className="text-gray-700 mb-2 flex-grow">
          {truncateText(stripHtml(project.description), 120)}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-block text-xs bg-primary text-white rounded px-2 py-1">
            {project.category.name}
          </span>
          <Link
            href={`/projects/${project.id}`}
            className="text-primary hover:text-primary/80 text-sm font-semibold"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>

                <div className="flex justify-center">
                  <Link
                    href="/projects"
                    className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow hover:bg-gray-900 transition"
                  >
                    View All Projects
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Client Testimonials Carousel */}
        <section className="w-full bg-white text-primary py-10 px-4">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <svg className="w-10 h-10 text-primary mb-4" fill="currentColor" viewBox="0 0 32 32">
              <text x="0" y="28" fontFamily="Arial Black, Arial, sans-serif" fontWeight="bold" fontSize="32">
                "
              </text>
            </svg>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : testimonials.length > 0 ? (
              <>
                <blockquote className="italic text-lg sm:text-xl text-center text-gray-700 mb-8 min-h-[120px]">
                  {testimonials[currentTestimonial]?.quote}
                </blockquote>
                <div className="flex flex-col items-center mb-6">
                  {testimonials[currentTestimonial]?.leaderImage ? (
                    <img
                      src={testimonials[currentTestimonial].leaderImage || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].leaderName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-2">
                      {getInitials(testimonials[currentTestimonial]?.leaderName || "")}
                    </div>
                  )}
                  <div className="font-bold text-primary text-lg">
                    {testimonials[currentTestimonial]?.leaderName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonials[currentTestimonial]?.role} at {testimonials[currentTestimonial]?.companyName}
                  </div>
                </div>
                {/* Dots */}
                <div className="flex gap-2 mb-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        i === currentTestimonial ? "bg-primary" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentTestimonial(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                {/* Arrows */}
                <div className="flex gap-8 justify-center">
                  <button
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition"
                    onClick={() =>
                      setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)
                    }
                    aria-label="Previous testimonial"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition"
                    onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
                    aria-label="Next testimonial"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No testimonials available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Certifications & Partners - Animated Logo Strip */}
     <section className="w-full bg-gray-50 text-primary py-10 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Certifications & Partners</h2>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : partners.length > 0 ? (
              <div className="relative w-full overflow-hidden">
                <div className="flex items-center gap-12 animate-partner-scroll whitespace-nowrap">
                  {/* Duplicate partners for seamless loop */}
                  {[...partners, ...partners].map((partner, index) => (
                    <img
                      key={`${partner.id}-${index}`}
                      src={partner?.image || "/placeholder.svg"}
                      alt={partner?.name}
                      className="h-12 w-auto transition inline-block"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No partners available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Project CTA Section */}
        <section className="relative bg-primary w-full min-h-[220px] flex items-center justify-center overflow-hidden">
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 py-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 drop-shadow-lg">
              Ready to Start Your Project?
            </h2>
            <p className="text-sm sm:text-base text-gray-100 mb-5 max-w-2xl mx-auto drop-shadow">
              Our team of experts is ready to help bring your vision to life with precision OMEGA SIR Ltd solutions.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary font-bold text-base px-6 py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition border-2 border-white"
            >
              Contact Us Today
            </Link>
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
      </div>
    </>
  )
}
