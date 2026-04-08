"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight} from "lucide-react"
import VideoBackground from "@/components/video-background"
import ScrollProgress from "@/components/ui/ScrollProgress"

interface BlogPost {
  id: string
  title: string
  createdAt: Date
  image: string
  excerpt: string
  content: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const postsPerPage = 4 // This should match the 'limit' in your API route or be configurable
    
  const scrollToBlogs = () => {
        const blogSection = document.getElementById('blogs')
        if (blogSection) {
          blogSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
      
  useEffect(() => {
   
    fetchPosts()
    const timer = setTimeout(() => {
      scrollToBlogs()
      }, 1500) // Delay of 1.5 seconds to allow hero section to be viewed briefly
      
      return () => clearTimeout(timer)
  }, [currentPage, postsPerPage])

  const totalPages = Math.ceil(totalPosts / postsPerPage)
 const fetchPosts = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"}/blogs?page=${currentPage}&limit=${postsPerPage}`,
          {
            cache: "no-store",
          },
        )
        if (!res.ok) {
          throw new Error(`Failed to fetch posts: ${res.statusText}`)
        }
        const data = await res.json()
        setPosts(data.blogs)
        setTotalPosts(data.total)
      } catch (err: any) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }
  return (
    <>
      <ScrollProgress />
      <VideoBackground />
      <div className="min-h-screen">
      {/* Hero Section for OMEGA SIR Ltd */}
<div className="relative inset-0 bg-gradient-to-b from-primary/90 text-white overflow-hidden">
  <div className="relative z-10 container mx-auto px-4 py-10">


    {/* Tagline */}
    <motion.h2
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="max-w-6xl mx-auto text-lg md:text-2xl text-blue-100 font-light italic mb-6 text-left"
    >
      "Building Trust, Designing Comfort, Managing Excellence."
    </motion.h2>

    {/* Description */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="max-w-6xl mx-auto text-blue-100 font-body text-left font-semibold text-base md:text-xl mb-8"
    >
      A multi-service company delivering excellence in{" "}
      <span className="text-white font-bold">Construction</span>,{" "}
      <span className="text-white font-bold">Building Maintenance</span>,{" "}
      <span className="text-white font-bold">Interior Design</span>,{" "}
      <span className="text-white font-bold">Projection Workshop</span>,{" "}
      <span className="text-white font-bold">Property Management</span>, and{" "}
      <span className="text-white font-bold">Cleaning Services</span>. We help
      you build, maintain, and grow with confidence.
    </motion.p>


            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.5,
                type: "spring",
                stiffness: 300,
              }}
              className="flex justify-center py-8"
            >
              <button className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all duration-300">
            <a href="#blogs">

                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </a>
              </button>
            </motion.div>
  </div>
</div>

        
    {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : posts.length >0?(
              <>
        {/* Blog Posts Section */}
        <section id="blogs" className="py-16 bg-white relative pb-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post, idx) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up group"
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {post.title?.substring(0,120)+ "..." }
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors duration-300 group-hover:gap-3"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls with Lucide Icons */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-blue-100 text-blue-800 disabled:opacity-40 hover:bg-blue-200 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded font-semibold border transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-blue-800 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-blue-100 text-blue-800 disabled:opacity-40 hover:bg-blue-200 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Bottom wave */}
          <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
            <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14">
              <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#1760b0" />
            </svg>
          </div>
        </section>
        </>
        ): (
              <div className="text-center py-12 relative pb-20">
                <p className="text-gray-500">No News available at the moment.</p>
                {/* Bottom wave */}
                <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
                  <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14">
                    <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#1760b0" />
                  </svg>
                </div>
              </div>
            )}
      </div>
    </>
  )
}
