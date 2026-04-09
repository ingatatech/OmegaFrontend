"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, User, Mail, Phone, FileText, Upload, Send, CheckCircle, AlertCircle, Loader2, MapPin, Clock, Briefcase, DollarSign, X } from 'lucide-react'
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ScrollProgress from "@/components/ui/ScrollProgress"
import { submitJobApplication } from "@/lib/api"
import { Job } from "@/lib/types"


interface FormData {
  fullName: string
  email: string
  phone: string
  coverLetter: File | null
  resume: File | null
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  resume?: string
  coverLetter?: string
}

export default function JobApplicationClient({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFoundError, setNotFoundError] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: null,
    resume: null,
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [dragActive, setDragActive] = useState({ resume: false, coverLetter: false })
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const coverLetterInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/jobs/${jobId}`)
        
        if (!res.ok) {
          if (res.status === 404) {
            setNotFoundError(true)
            return
          }
          throw new Error("Failed to fetch job")
        }

        const jobData = await res.json()
        
        // Check if job is still active
        if (jobData.status !== "active") {
          setError("This job position is no longer accepting applications.")
          return
        }

        setJob(jobData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.resume) {
      newErrors.resume = "Resume is required"
    } else if (formData.resume.size > 5 * 1024 * 1024) {
      newErrors.resume = "Resume file size must be less than 5MB"
    }

    if (!formData.coverLetter) {
      newErrors.coverLetter = "Cover letter is required"
    } else if (formData.coverLetter.size > 5 * 1024 * 1024) {
      newErrors.coverLetter = "Cover letter file size must be less than 5MB"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !job || !formData.resume || !formData.coverLetter) return

    try {
      setSubmitting(true)
      setError(null)

      await submitJobApplication({
        jobId: job.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        resume: formData.resume,
        coverLetter: formData.coverLetter,
      })

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileChange = (file: File | null, type: 'resume' | 'coverLetter') => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, [type]: "Please upload a PDF, DOC, or DOCX file" })
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [type]: "File size must be less than 5MB" })
        return
      }

      setFormData({ ...formData, [type]: file })
      setErrors({ ...errors, [type]: undefined })
    }
  }

  const handleDrag = (e: React.DragEvent, type: 'resume' | 'coverLetter') => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive({ ...dragActive, [type]: true })
    } else if (e.type === "dragleave") {
      setDragActive({ ...dragActive, [type]: false })
    }
  }

  const handleDrop = (e: React.DragEvent, type: 'resume' | 'coverLetter') => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive({ ...dragActive, [type]: false })

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0], type)
    }
  }

  if (notFoundError) {
    notFound()
  }

  if (loading) {
    return (
      <>
        <ScrollProgress />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading job details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error && !job) {
    return (
      <>
        <ScrollProgress />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Unavailable</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/careers">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Careers
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (submitted) {
    return (
      <>
        <ScrollProgress />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for applying for the <strong>{job?.title}</strong> position.
            </p>
            <p className="text-gray-600 mb-8">
              We've received your application and will review it carefully. You should hear back from us within 5-7 business days.
            </p>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <span className="text-gray-600">Application review by our HR team</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <span className="text-gray-600">Initial screening call (if selected)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <span className="text-gray-600">Technical/behavioral interviews</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">4</span>
                  </div>
                  <span className="text-gray-600">Final decision and offer</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/careers">
                <Button variant="outline" className="px-6 py-2">
                  View More Jobs
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 relative pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>
            
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Apply for {job?.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {job?.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {job?.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      {job?.experience}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      {job?.salary}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {job?.department}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    Deadline: {job?.deadline ? new Date(job.deadline).toLocaleDateString() : "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Application Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Form</h2>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            errors.fullName ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                        }`}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+250 123 456 789"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Resume/CV *
                    </h3>
                    
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        dragActive.resume
                          ? "border-primary bg-primary/5"
                          : errors.resume
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-primary/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, 'resume')}
                      onDragLeave={(e) => handleDrag(e, 'resume')}
                      onDragOver={(e) => handleDrag(e, 'resume')}
                      onDrop={(e) => handleDrop(e, 'resume')}
                    >
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'resume')}
                        className="hidden"
                      />
                      
                      {formData.resume ? (
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-medium">{formData.resume.name}</span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, resume: null })}
                              className="text-green-600 hover:text-green-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            <button
                              type="button"
                              onClick={() => resumeInputRef.current?.click()}
                              className="text-primary hover:text-primary/80 font-medium"
                            >
                              Click to upload
                            </button>{" "}
                            or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                    
                    {errors.resume && (
                      <p className="text-red-500 text-sm">{errors.resume}</p>
                    )}
                  </div>

                  {/* Cover Letter Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Cover Letter *
                    </h3>
                    
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        dragActive.coverLetter
                          ? "border-primary bg-primary/5"
                          : errors.coverLetter
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-primary/50"
                      }`}
                      onDragEnter={(e) => handleDrag(e, 'coverLetter')}
                      onDragLeave={(e) => handleDrag(e, 'coverLetter')}
                      onDragOver={(e) => handleDrag(e, 'coverLetter')}
                      onDrop={(e) => handleDrop(e, 'coverLetter')}
                    >
                      <input
                        ref={coverLetterInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'coverLetter')}
                        className="hidden"
                      />
                      
                      {formData.coverLetter ? (
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-medium">{formData.coverLetter.name}</span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, coverLetter: null })}
                              className="text-green-600 hover:text-green-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            <button
                              type="button"
                              onClick={() => coverLetterInputRef.current?.click()}
                              className="text-primary hover:text-primary/80 font-medium"
                            >
                              Click to upload
                            </button>{" "}
                            or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                    
                    {errors.coverLetter && (
                      <p className="text-red-500 text-sm">{errors.coverLetter}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-100">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Job Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Job Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium text-gray-800">{job?.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-800">{job?.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-800">{job?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium text-gray-800">{job?.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="font-medium text-primary">{job?.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Application Tips */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Tailor your resume to match the job requirements
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Write a compelling cover letter explaining your interest
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Highlight relevant experience and achievements
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Double-check all information before submitting
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Have questions about this position? Contact our HR team.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>omegasirltd@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+250 781 185 860 / +250 781 812 466 / +250 783 075 259</span>
                    </div>
                  </div>
                </div>
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
