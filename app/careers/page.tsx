"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Briefcase, MapPin, Clock, Send, Users, FileText, Search, Filter, ChevronDown, CheckCircle, Star, TrendingUp, Heart, Target, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ScrollProgress from "@/components/ui/ScrollProgress"
import { fetchJobs } from "@/lib/api"
import { Job } from "@/lib/types"
import Link from "next/link"

const steps = [
  {
    number: 1,
    title: "Submit Application",
    description: "Fill out our online application form and upload your resume and cover letter",
    icon: Send,
  },
  {
    number: 2,
    title: "Initial Review",
    description: "Our HR team reviews applications and selects qualified candidates for interviews",
    icon: FileText,
  },
  {
    number: 3,
    title: "Interview Process",
    description: "Multiple interview rounds to assess technical skills and cultural fit",
    icon: Users,
  },
  {
    number: 4,
    title: "Offer & Onboarding",
    description: "Successful candidates receive offers and join our comprehensive onboarding program",
    icon: CheckCircle,
  },
]

// Job Card Component
const JobCard = ({ job, index }: { job: Job; index: number;  }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 ${
        job.featured ? "ring-2 ring-primary/20 border-primary/20" : ""
      }`}
    >
      {job.featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/80 text-white px-4 py-2 rounded-bl-2xl">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="w-4 h-4" />
            Featured
          </div>
        </div>
      )}

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h3>
            <Badge variant="secondary" className="mb-3">
              {job.department}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {job.location}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {job.type}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              {job.experience}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full text-sm inline-block mb-4">
            {job.salary}
          </div>
          <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }}/>
        </div>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-primary font-medium mb-4 hover:text-primary/80 transition-colors"
          whileHover={{ x: 5 }}
        >
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
          {isExpanded ? "Show Less Details" : "View Full Details"}
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 mb-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {job.responsibilities.map((item: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Requirements
                  </h4>
                  <ul className="space-y-2">
                    {job.qualifications.map((item: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {job.preferred && job.preferred.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Preferred Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.preferred.map((skill: string, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Benefits & Perks
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {job.benefits.map((benefit: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Application Deadline:{" "}
            <span className="font-medium text-gray-700">
              {new Date(job.deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
            </span>
          </div>

         <Link href={`/careers/apply/${job.id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Send className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}



export default function EnhancedCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")


  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

  useEffect(() => {
    loadJobs()
      const timer = setTimeout(() => {
      scrollToCareers()
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

     const loadJobs = async () => {
      try {
        setLoading(true)
        const jobsData = await fetchJobs()
        // Filter only active jobs
        const activeJobs = jobsData.filter((job: Job) => job.status === "active")
        setJobs(activeJobs)
      } catch (err) {
        setError("Failed to load job listings")
        console.error("Error loading jobs:", err)
      } finally {
        setLoading(false)
      }
    }
  const scrollToCareers = () => {
        const jobsSection = document.getElementById('jobs')
        if (jobsSection) {
          jobsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
  // Get unique departments from jobs
  const departments = ["All", ...Array.from(new Set(jobs.map((job) => job.department)))]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "All" || job.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })



  return (
    <>
      <ScrollProgress />

      <div className="min-h-screen bg-gradient-to-br  text-gray-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />

          {/* Enhanced Hero Section */}
          <section className="bg-gradient-to-br  from-primary/90 via-primary/60 to-primary flex items-center justify-center overflow-hidden py-20">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-6xl mx-auto"
              >
                <motion.h1
                  className="text-4xl font-bold mb-6 text-white drop-shadow-2xl text-left"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Join the{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    OMEGA SIR
                  </span>{" "}
                  Team
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg leading-relaxed text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  At OMEGA SIR Ltd, we build more than spaces, we build futures. Join a team committed to excellence,
                  innovation, and community impact.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-start"
                >
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View Open Positions
                    <ChevronDown className="ml-2 w-5 h-5" />
                  </Button>
                
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-left max-w-6xl mx-auto">Why Choose OMEGA SIR?</h2>
                <p className="text-xl text-gray-600 max-w-6xl mx-auto text-left">
                  We're more than just a workplace, we're a community of passionate professionals building the future
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                  {
                    title: "Our Mission",
                    desc: "We deliver top-tier construction, cleaning, and repair solutions that enrich communities and support sustainable development.",
                    icon: Target,
                  },
                  {
                    title: "Career Growth",
                    desc: "We offer clear career paths, leadership mentoring, and learning opportunities to help you grow professionally.",
                    icon: TrendingUp,
                  },
                  {
                    title: "Inclusive Environment",
                    desc: "We embrace diversity and provide a workplace where all voices are heard and valued equally.",
                    icon: Users,
                  },
                  {
                    title: "Giving Back",
                    desc: "We actively engage in community projects, promoting environmental and social responsibility.",
                    icon: Heart,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100"
                  >
                    <motion.div
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

      

          {/* Job Listings Section */}
          <section id="jobs" className="py-5 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Current Opportunities</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Find your next career opportunity and join our growing team
                </p>
              </motion.div>

              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search positions..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                  <select
                    className="pl-12 pr-8 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white min-w-[200px]"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Job Cards */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading job opportunities...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Jobs</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job, index) => (
                      <JobCard key={job.id} job={job} index={index} />
                    ))
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No positions found</h3>
                      <p className="text-gray-600">
                        Try adjusting your search criteria or check back later for new opportunities.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Application Process */}
          <section className="py-5 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Application Process</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our streamlined hiring process is designed to find the best talent while providing a great candidate
                  experience
                </p>
              </motion.div>

              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="text-center relative"
                    >
                      {/* Connection Line */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-primary/20 z-0" />
                      )}

                      <motion.div
                        className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white mb-6 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <step.icon className="w-10 h-10" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        
        </div>

    </>
  )
}
