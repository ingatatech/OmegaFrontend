"use client"
import { useState, useEffect } from "react"
import {
  MapPin,
  Star,
  ArrowLeft,
  Quote,
  Building,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Send,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Project } from "@/lib/types"
import ScrollProgress from "@/components/ui/ScrollProgress"
import Loader from "../Loader"

export default function ProjectDetailClient({ id }: { id: string }) {
  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFoundError, setNotFoundError] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      setNotFoundError(false)

      try {
        // Fetch single project
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/projects/${id}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          if (res.status === 404) {
            setNotFoundError(true)
            return
          }
          throw new Error("Failed to fetch project")
        }

        const fetchedProject = await res.json()
        setProject(fetchedProject)
        setSelectedImage(fetchedProject.imageAfter)

        // Fetch all projects for related projects
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/projects`, {
          cache: "no-store",
        })

        if (!allRes.ok) throw new Error("Failed to fetch all projects")

        const allProjectsData = await allRes.json()
        const allProjectsArray = allProjectsData || []
        const otherProjects = allProjectsArray.filter((p: Project) => p.id !== fetchedProject.id)

        // Related projects (same category)
        const related = otherProjects
          .filter((p: Project) => p.category.name === fetchedProject.category.name)
          .slice(0, 3)
        setRelatedProjects(related)
      } catch (err: any) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (notFoundError) {
    notFound()
  }

  if (loading) {
    return (
      <>
        <ScrollProgress />
     	<div className="min-h-screen py-10 bg-white flex items-center justify-center">
      <Loader size="lg" />
    </div>
      </>
    )
  }

  if (error || !project) {
    return (
      <>
        <ScrollProgress />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">Error: {error || "Project not found"}</p>
            <Link href="/projects">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Back to Projects
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }


  const allImages = [project.imageAfter, project.imageBefore, ...project.gallery].filter(Boolean)

  // Social share URLs
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/projects/${project.id}`
  const shareTitle = `Check out this amazing project: ${project.name}`

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 relative pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt={project.name}
                    className="w-full h-80 object-cover"
                  />
                  <Link
                    href="/projects"
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors flex items-center gap-2 shadow"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Projects</span>
                  </Link>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold">
                        {project.category.name}
                      </span>
                      {project.testimonials.length > 0 && (
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          {project.testimonials.length} Testimonial{project.testimonials.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.name}</h1>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span>
                            <strong>Location:</strong> {project.location}
                          </span>
                        </div>
                    
                       
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-primary" />
                          <span>
                            <strong>Category:</strong> {project.category.name}
                          </span>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {allImages.length > 1 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Project Gallery</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {allImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                              selectedImage === img ? "ring-2 ring-primary ring-offset-2" : "hover:scale-105"
                            }`}
                          >
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`${project.name} image ${idx + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            {idx === 0 && (
                              <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                After
                              </div>
                            )}
                            {idx === 1 && (
                              <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                Before
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Project Description</h3>
                      <div
                        className="text-gray-700 leading-relaxed prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                      />
                    </div>

                    {/* Social Sharing */}
                    <div className="flex items-center gap-4 pt-6 border-t">
                      <span className="text-gray-700 font-semibold flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share:
                      </span>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on X (Twitter)"
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-blue-500" />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Facebook"
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on LinkedIn"
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-blue-700" />
                      </a>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on WhatsApp"
                        className="p-2 rounded-full bg-gray-100 hover:bg-green-100 transition-colors"
                      >
                        <Send className="w-4 h-4 text-green-500" />
                      </a>
                    </div>

                    {/* Client Testimonials */}
                    {project.testimonials.length > 0 && (
                      <div className="pt-6 border-t">
                        <h3 className="text-xl font-semibold mb-4">Client Testimonials</h3>
                        <div className="space-y-6">
                          {project.testimonials.map((testimonial) => (
                            <div
                              key={testimonial.id}
                              className="bg-gradient-to-r from-primary/5 to-blue-50 p-6 rounded-xl border-l-4 border-primary"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <img
                                    src={testimonial.leaderImage || "/placeholder.svg"}
                                    alt={testimonial.leaderName}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Quote className="w-5 h-5 text-primary" />
                                    <span className="text-sm text-gray-500">
                                      {testimonial.approved ? "Verified" : "Pending"} Testimonial
                                    </span>
                                  </div>
                                  <p className="text-gray-700 italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-primary">{testimonial.leaderName}</p>
                                      <p className="text-sm text-gray-600">
                                        {testimonial.role} at {testimonial.companyName}
                                      </p>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(testimonial.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Project Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Project Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Testimonials</span>
                      <span className="font-semibold text-primary">{project.testimonials.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gallery Images</span>
                      <span className="font-semibold text-primary">{allImages.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Category</span>
                      <span className="font-semibold text-primary">{project.category.name}</span>
                    </div>
                  </div>
                </div>

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Related Projects</h3>
                    <div className="space-y-4">
                      {relatedProjects.map((relatedProject) => (
                        <Link
                          key={relatedProject.id}
                          href={`/projects/${relatedProject.id}`}
                          className="block group hover:bg-gray-50 rounded-lg p-3 transition-colors"
                        >
                          <div className="flex gap-3">
                            <img
                              src={relatedProject.imageAfter || "/placeholder.svg"}
                              alt={relatedProject.name}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                {relatedProject.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">{relatedProject.location}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-500">
                                  {relatedProject.testimonials.length} testimonials
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {project.testimonials.length === 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 text-center">
                    <p className="text-gray-600">No testimonials available for this project yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom wave */}
        <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
          <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14">
            <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#1760b0" />
          </svg>
        </div>
      </div>
    </>
  )
}
