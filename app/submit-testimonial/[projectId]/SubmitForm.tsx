"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { createTestimonial, fetchProjectById } from "@/lib/api"
import Link from "next/link"

interface Props {
  projectId: string
}

interface Project {
  id: string
  name: string
  description: string
  imageAfter: string
  location: string
}

export default function SubmitForm({ projectId }: Props) {
  const [project, setProject] = useState<Project | null>(null)
  const [loadingProject, setLoadingProject] = useState(true)
  const [form, setForm] = useState({
    leaderName: "",
    companyName: "",
    role: "",
    quote: "",
  })
  const [leaderImageFile, setLeaderImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      setLoadingProject(true)
      try {
        const res = await fetchProjectById(projectId)
        setProject(res.data)
      } catch (err) {
      
        setProject(null)
      } finally {
        setLoadingProject(false)
      }
    }
    loadProject()
  }, [projectId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLeaderImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) {
      toast.error("Project not found. Cannot submit testimonial.")
      return
    }
    if (!form.leaderName || !form.companyName || !form.role || !form.quote) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("leaderName", form.leaderName)
      formData.append("companyName", form.companyName)
      formData.append("role", form.role)
      formData.append("quote", form.quote)
      formData.append("projectId", project.id)
      if (leaderImageFile) {
        formData.append("leaderImage", leaderImageFile)
      }

      await createTestimonial(formData)
      setSubmissionSuccess(true)
      toast.success("Testimonial submitted successfully!")
      setForm({ leaderName: "", companyName: "", role: "", quote: "" })
      setLeaderImageFile(null)
    } catch (error) {
      console.error("Error submitting testimonial:", error)
      toast.error("Failed to submit testimonial.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingProject) {
    return <p className="text-center py-12">Loading project details...</p>
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Project Not Found</h1>
        <Link href="/" className="mt-6 text-primary hover:underline">
          Go to Homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardHeader className="text-center bg-primary/5 py-6 rounded-t-2xl">
          <CardTitle className="text-3xl font-bold text-gray-800">Submit Testimonial</CardTitle>
          <p className="text-gray-600 mt-2">
            Share your experience with our project: <span className="font-semibold text-primary">{project.name}</span>
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {submissionSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You for Your Testimonial!</h2>
              <Button onClick={() => setSubmissionSuccess(false)} className="bg-primary hover:bg-primary/90">
                Submit Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields */}
                          <div>
  <label htmlFor="leaderImage" className="block text-sm font-medium text-gray-700 mb-2">
    Your Photo *
  </label>
  <Input
    id="leaderImage"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
  />

  {leaderImageFile && (
    <div className="mt-4 text-center">
      <img
        src={URL.createObjectURL(leaderImageFile)}
        alt="Leader Preview"
        className="w-32 h-32 object-cover rounded-full shadow-md mx-auto border border-gray-200"
      />
    </div>
  )}
</div>

              <Input name="leaderName" value={form.leaderName} onChange={handleInputChange} placeholder="Your Name *" />
              <Input name="companyName" value={form.companyName} onChange={handleInputChange} placeholder="Company *" />
              <Input name="role" value={form.role} onChange={handleInputChange} placeholder="Role *" />
              <Textarea name="quote" value={form.quote} onChange={handleInputChange} placeholder="Testimonial *" />

              <Button type="submit" disabled={isSubmitting} className="text-white">
                {isSubmitting ? "Submitting..." : "Send"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
