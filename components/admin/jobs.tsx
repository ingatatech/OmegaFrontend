"use client"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Search, Edit, Trash2, Plus, Star, Calendar, MapPin, Briefcase, DollarSign, X, Eye, Clock, Users, CheckCircle, Award } from 'lucide-react'
import RichTextEditor from "@/components/ui/RichTextEditor"
import { motion, AnimatePresence } from "framer-motion"

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  preferred: string[]
  benefits: string[]
  deadline: string
  status: "active" | "closed"
  featured: boolean
  createdAt: string
  applicationsCount?: number
  newApplicationsCount?: number
  closureReason?: string
}




export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [viewingJob, setViewingJob] = useState<Job | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    salary: "",
    description: "",
    responsibilities: [""],
    qualifications: [""],
    preferred: [""],
    benefits: [""],
    deadline: "",
    status: "active" as "active" | "closed",
    featured: false,
  })

  const pageSize = 10
  const departments = ["Construction", "Cleaning Services", "Administration", "Engineering", "Management"]
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const res = await api.get("/jobs")
      // Add mock application counts
      const jobsWithApplications = res.data.map((job: Job) => ({
        ...job,
        applicationsCount: Math.floor(Math.random() * 25),
        newApplicationsCount: Math.floor(Math.random() * 5),
      }))
      setJobs(jobsWithApplications)
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setIsSubmitting(true)

      const cleanedData = {
        ...formData,
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        qualifications: formData.qualifications.filter((q) => q.trim()),
        preferred: formData.preferred.filter((p) => p.trim()),
        benefits: formData.benefits.filter((b) => b.trim()),
      }

      if (editingJob) {
        await api.patch(`/jobs/${editingJob.id}`, cleanedData)
        toast.success("Job updated successfully!")
      } else {
        await api.post("/jobs", cleanedData)
        toast.success("Job created successfully!")
      }

      setShowModal(false)
      setEditingJob(null)
      resetForm()
      fetchJobs()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save job")
    }
	finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(job: Job) {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      responsibilities: job.responsibilities.length ? job.responsibilities : [""],
      qualifications: job.qualifications.length ? job.qualifications : [""],
      preferred: job.preferred?.length ? job.preferred : [""],
      benefits: job.benefits?.length ? job.benefits : [""],
      deadline: new Date(job.deadline).toISOString().split("T")[0],
      status: job.status,
      featured: job.featured,
    })
    setShowModal(true)
  }

  function handleView(job: Job) {
    setViewingJob(job)
    setShowViewModal(true)
  }

 

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      await api.delete(`/jobs/${id}`)
      toast.success("Job deleted successfully!")
      fetchJobs()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete job")
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      experience: "",
      salary: "",
      description: "",
      responsibilities: [""],
      qualifications: [""],
      preferred: [""],
      benefits: [""],
      deadline: "",
      status: "active",
      featured: false,
    })
  }

  function openAddModal() {
    setEditingJob(null)
    resetForm()
    setShowModal(true)
  }

  const addArrayItem = (field: keyof typeof formData, value = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value],
    }))
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  const updateArrayItem = (field: keyof typeof formData, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => (i === index ? value : item)),
    }))
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200"
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "Full-time": "bg-primary/10 text-primary border-primary/20",
      "Part-time": "bg-blue-100 text-blue-800 border-blue-200",
      Contract: "bg-purple-100 text-purple-800 border-purple-200",
      Internship: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <AdminLayout title="Job Management" showAddButton={true} onAddClick={openAddModal} addButtonText="Add Job">
      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search jobs by title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[180px]"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </motion.div>

      {/* Jobs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs....</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-500 mb-6">No jobs match your search criteria</p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Job
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Job Title</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Department</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Salary</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Deadline</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
           {paginatedJobs.map((job, index) => (
  <motion.tr
    key={job.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ delay: index * 0.05 }}
    className="hover:bg-primary/5 transition-colors duration-200 h-12"
  >
    <td className="px-3 py-1 text-sm text-gray-900 align-middle">{(page - 1) * pageSize + index + 1}</td>
    
    {/* Single Line Job Title with Experience */}
    <td className="px-3 py-1 max-w-[250px] align-middle">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-900 truncate block">
            {job.title}
            {job.experience && <span className="text-xs text-gray-500 ml-2">({job.experience})</span>}
          </span>
        </div>
        {job.featured && (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-1 py-0 flex-shrink-0">
            <Star className="w-3 h-3" />
          </Badge>
        )}
      </div>
    </td>
    
    {/* Single Line Department */}
    <td className="px-3 py-1 align-middle">
      <div className="flex items-center gap-1 overflow-hidden">
        <Briefcase className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-900 truncate">{job.department}</span>
      </div>
    </td>
    
    {/* Single Line Location */}
    <td className="px-3 py-1 align-middle">
      <div className="flex items-center gap-1 overflow-hidden">
        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-900 truncate">{job.location}</span>
      </div>
    </td>
    
    {/* Single Line Type */}
    <td className="px-3 py-1 align-middle">
      <Badge className={`${getTypeColor(job.type)} border text-xs px-2 py-0.5`}>{job.type}</Badge>
    </td>
    
    {/* Single Line Salary */}
    <td className="px-3 py-1 align-middle">
      <div className="flex items-center gap-1 overflow-hidden">
        <DollarSign className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-900 truncate">{job.salary}</span>
      </div>
    </td>
    
    {/* Single Line Status */}
    <td className="px-3 py-1 align-middle">
      <Badge className={`${getStatusColor(job.status)} border text-xs px-2 py-0.5`}>{job.status}</Badge>
    </td>
    
    {/* Single Line Deadline */}
    <td className="px-3 py-1 align-middle">
      <div className="flex items-center gap-1 overflow-hidden">
        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-600 whitespace-nowrap">
          {new Date(job.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          })}
        </span>
      </div>
    </td>
    
    {/* Single Line Actions */}
    <td className="px-3 py-1 align-middle">
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleView(job)}
          className="border-blue-200 text-blue-600 hover:bg-blue-50 h-6 w-6 p-0"
          title="View"
        >
          <Eye className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(job)}
          className="border-primary/20 text-primary hover:bg-primary/5 h-6 w-6 p-0"
          title="Edit"
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleDelete(job.id)}
          className="border-red-200 text-red-600 hover:bg-red-50 h-6 w-6 p-0"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </td>
  </motion.tr>
))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center justify-between"
        >
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredJobs.length)} of{" "}
            {filteredJobs.length} results
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border-gray-200"
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="border-gray-200"
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {/* View Job Modal */}
      <AnimatePresence>
        {showViewModal && viewingJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 sm:px-8 py-6 relative">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">{viewingJob.title}</h2>
                      {viewingJob.featured && (
                        <Badge className="bg-yellow-400 text-yellow-900 border-0 shadow-sm">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={`${getStatusColor(viewingJob.status)} border-0 shadow-sm`}>
                        {viewingJob.status === "active" ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                        ) : (
                          <><X className="w-3 h-3 mr-1" /> Closed</>
                        )}
                      </Badge>
                      <Badge className={`${getTypeColor(viewingJob.type)} border-0 shadow-sm`}>
                        {viewingJob.type}
                      </Badge>
                      {viewingJob.applicationsCount !== undefined && (
                        <Badge className="bg-blue-500 text-white border-0 shadow-sm">
                          <Users className="w-3 h-3 mr-1" />
                          {viewingJob.applicationsCount} Applications
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Job Info Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Department</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{viewingJob.department}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Location</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{viewingJob.location}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Salary</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{viewingJob.salary}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Experience</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{viewingJob.experience}</p>
                  </div>
                </div>

                {/* Deadline Alert */}
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Application Deadline</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(viewingJob.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Job Description</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border border-gray-100">
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewingJob.description }} />
                  </div>
                </div>

                {/* Responsibilities */}
                {viewingJob.responsibilities.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 sm:p-6 border border-blue-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-2">
                      {viewingJob.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="p-1 bg-blue-600 rounded-full mt-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <span className="text-sm text-gray-800">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Qualifications */}
                {viewingJob.qualifications.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-5 sm:p-6 border border-green-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Required Qualifications
                    </h3>
                    <ul className="space-y-2">
                      {viewingJob.qualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="p-1 bg-green-600 rounded-full mt-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <span className="text-sm text-gray-800">{qualification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preferred Skills */}
                {viewingJob.preferred && viewingJob.preferred.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-5 sm:p-6 border border-purple-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Preferred Skills
                    </h3>
                    <ul className="space-y-2">
                      {viewingJob.preferred.map((skill, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="p-1 bg-purple-600 rounded-full mt-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <span className="text-sm text-gray-800">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {viewingJob.benefits && viewingJob.benefits.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-5 sm:p-6 border border-yellow-200 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Benefits & Perks
                    </h3>
                    <ul className="space-y-2">
                      {viewingJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="p-1 bg-yellow-600 rounded-full mt-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <span className="text-sm text-gray-800">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Closure Reason */}
                {viewingJob.closureReason && (
                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-5 border border-red-200">
                    <h3 className="text-sm font-semibold text-red-900 uppercase tracking-wider mb-3">Job Closure Reason</h3>
                    <p className="text-sm text-red-800">{viewingJob.closureReason}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 sm:px-8 py-5 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowViewModal(false)}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false)
                      handleEdit(viewingJob)
                    }}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Job
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingJob ? "Edit Job" : "Add New Job"}</h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Kigali, Rwanda"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                    >
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required *</label>
                    <Input
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g. 3+ years"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range *</label>
                    <Input
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="e.g. $3,000 - $4,500"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mark as Featured Job
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(val) => setFormData({ ...formData, description: val })}
                    placeholder="Write a detailed job description..."
                  />
                </div>

                {/* Dynamic Arrays */}
                {[
                  { key: "responsibilities", label: "Key Responsibilities", required: true },
                  { key: "qualifications", label: "Required Qualifications", required: true },
                  { key: "preferred", label: "Preferred Skills", required: false },
                  { key: "benefits", label: "Benefits & Perks", required: false },
                ].map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label} {required && "*"}
                    </label>
                    <div className="space-y-2">
                      {(formData[key as keyof typeof formData] as string[]).map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateArrayItem(key as keyof typeof formData, index, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                            className="flex-1 border-gray-200 focus:border-primary focus:ring-primary/20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem(key as keyof typeof formData, index)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem(key as keyof typeof formData)}
                        className="border-primary/20 text-primary hover:bg-primary/5"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add {label.slice(0, -1)}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
           
					<Button
					type="submit"
					onClick={handleSave}
					disabled={isSubmitting}
					className="flex-1 bg-primary hover:bg-primary/90 text-white"
				  >
					{isSubmitting ? (
					  <div className="flex items-center justify-center gap-2">
						<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						{editingJob ? "Updating..." : "Submitting..."}
					  </div>
					) : (
					  editingJob ? "Save" : "Save"
					)}
				  </Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-gray-200">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
