"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, Twitter, Facebook, Linkedin, Send, ArrowLeft } from "lucide-react"
import ScrollProgress from "@/components/ui/ScrollProgress"
import Loader from "../Loader"



function getReadingTime(text: string) {
  const words = text ? text.split(/\s+/).length : 0
  return Math.max(1, Math.round(words / 200)) // 200 wpm
}

interface BlogType {
  id: string
  title: string
  content: string
  image?: string
  createdAt: string
  excerpt?: string
 
}

export default function BlogDetailClient({ id }: { id: string }) {
  const [blog, setBlog] = useState<BlogType | null>(null)
  const [popularBlogs, setPopularBlogs] = useState<BlogType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      setNotFoundError(false)

      try {
        // Fetch single blog
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/blogs/${id}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          if (res.status === 404) {
            setNotFoundError(true)
            return
          }
          throw new Error("Failed to fetch blog")
        }

        const fetchedBlog = await res.json()
        setBlog(fetchedBlog)

        // Fetch all blogs for sidebar, navigation, and related
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/blogs`, {
          cache: "no-store",
        })

        if (!allRes.ok) throw new Error("Failed to fetch all blogs")

        const allBlogsData = await allRes.json()
        const allBlogsArray = allBlogsData.blogs || allBlogsData || []
        const otherBlogs = allBlogsArray.filter((b: BlogType) => b.id !== fetchedBlog.id)
        setPopularBlogs(otherBlogs)
      } catch (err) {
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

  if (error || !blog) {
    return (
      <>
        <ScrollProgress />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Error: {error || "Blog not found"}</p>
            <Link href="/blog" className="text-primary hover:text-primary/80 underline">
              Back to Blog
            </Link>
          </div>
        </div>
      </>
    )
  }

  // Social share URLs
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/blog/${blog.id}`
  const shareTitle = blog.title

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 relative pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Blog Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    width={800}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <Link
                    href="/blog"
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors flex items-center gap-2 shadow"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to News</span>
                  </Link>
                </div>

                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                  
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{getReadingTime(blog?.content || blog.excerpt || "")} min read</span>
                    </div>

                  </div>

                  <h1 className="text-4xl font-bold mb-6 text-gray-900">{blog.title}</h1>

                

                  <div
                    className="prose prose-lg max-w-none text-gray-900 mb-8"
                    dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt || "" }}
                  />

                  {/* Social Sharing */}
                  <div className="flex items-center gap-4 pt-6 border-t">
                    <span className="text-gray-700 font-semibold">Share:</span>
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

               
                </div>
              </div>
            </div>

            {/* Sidebar with, Popular, and More Blogs */}
            <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
           

              {/* Popular Blogs */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Popular Articles</h2>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {popularBlogs.map((popularBlog: BlogType) => (
                    <Link
                      key={popularBlog.id}
                      href={`/blog/${popularBlog.id}`}
                      className={`flex items-center space-x-3 group p-3 rounded-lg transition-all duration-200 ${
                        popularBlog.id === blog.id ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={popularBlog.image || "/placeholder.svg"}
                          alt={popularBlog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-gray-900 font-medium group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {popularBlog.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(popularBlog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
                       
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Blog Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Article Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reading Time</span>
                    <span className="font-semibold text-primary">
                      {getReadingTime(blog?.content || blog.excerpt || "")} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Published</span>
                    <span className="font-semibold text-primary">{new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</span>
                  </div>
            
                </div>
              </div>
            </aside>
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
