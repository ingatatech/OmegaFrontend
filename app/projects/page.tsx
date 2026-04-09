"use client"
import { useState, useEffect } from "react"
import {
  Filter,
  Grid,
  List,
  Star,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { fetchProjects } from "@/lib/api"
import type { Project } from "@/lib/types"
import ScrollProgress from "@/components/ui/ScrollProgress"
import { motion } from "framer-motion"
import VideoBackground from "@/components/video-background"
import Loader from "@/components/Loader"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState("All Projects")
  const [viewMode, setViewMode] = useState("grid")
// const currentYear = new Date().getFullYear();
// const yearsExperience = currentYear - 2014 + 1;

  useEffect(() => {
    loadProjects()

    // Auto-scroll to projects section after a short delay
    const timer = setTimeout(() => {
      scrollToProjects()
    }, 1500) // Delay of 1.5 seconds to allow hero section to be viewed briefly
    
    return () => clearTimeout(timer)
  }, [])

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await fetchProjects()
      setProjects(data)
    } catch (err) {
  
      console.error("Error loading projects:", err)
    } finally {
      setLoading(false)
    }
  }
  // Get unique categories from projects
  const categories = ["All Projects", ...Array.from(new Set(projects.map((p) => p.category.name)))]

  const filteredProjects =
    selectedCategory === "All Projects" ? projects : projects.filter((p) => p.category.name === selectedCategory)

 

  // Helper function to strip HTML tags from description
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
      <VideoBackground/>
      <div className="min-h-screen">
        {/* Hero Section */}
 <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary/70 to-primary/90 text-white">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10 z-0" />

      <div className="relative max-w-6xl mx-auto px-4 py-10 text-center z-10">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl  font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-left"
        >
          Our Success Stories
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-blue-100 max-w-6xl mx-auto leading-relaxed text-left"
        >
          Discover the quality and diversity of our completed projects. From
          construction to cleaning, we take pride in every job and strive for
          excellence in all we do.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 250 }}
          className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center mt-10"
        >
          <button
            onClick={scrollToProjects}
            className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow hover:bg-gray-100 transition w-fit text-center"
          >
            View Projects
          </button>
          <a
            href="/contact"
            className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-primary transition w-fit text-center block"
          >
            Start Your Project
          </a>
        </motion.div>

    
      </div>
    </section>

        {/* All Projects Section */}
        <section id="projects" className="relative py-10 bg-white pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">All Projects</h2>
                <p className="text-gray-600 text-lg">Browse our complete portfolio of successful projects</p>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 lg:mt-0">
                {/* Category Filter */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <Filter className="w-5 h-5 text-gray-500 ml-3" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent border-none outline-none px-3 py-2 text-gray-700 font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-primary text-white" : "text-gray-600"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-primary text-white" : "text-gray-600"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid/List */}
            {loading ?(
         	<div className="min-h-screen py-10 bg-white flex items-center justify-center">
      <Loader size="lg" />
    </div>
            ):filteredProjects.length > 0 ? (
               <div className={`grid gap-8 ${viewMode === "grid" ? "lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                    <img
                      src={project?.imageAfter }
                      alt={project.name}
                      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-48"
                      }`}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary rounded-full text-sm font-semibold">
                        {project.category.name}
                      </span>
                    </div>
                    {project.testimonials.length > 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold ml-1">{project.testimonials.length}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                    </div>

                    <div className="space-y-1 mb-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                   
                    
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                      {truncateText(stripHtml(project.description), 150)}
                    </p>

                    {project.testimonials.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 italic">
                          "{truncateText(project.testimonials[0].quote, 80)}"
                        </p>
                        <p className="text-xs text-primary font-semibold mt-1">
                          - {project.testimonials[0].leaderName}, {project.testimonials[0].companyName}
                        </p>
                      </div>
                    )}

                    <Link href={`/projects/project?id=${project.id}`}>
                      <button className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            ):(
               <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No projects found for the selected category.</p>
              </div>
            )}
          </div>
          {/* Bottom wave */}
          <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
            <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14">
              <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#1760b0" />
            </svg>
          </div>
        </section>
      </div>
    </>
  )
}

