"use client"
import { useState, useEffect } from "react"
import type React from "react"
import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { XCircle, Edit, Trash, X, Search, Eye } from "lucide-react"
import { fetchTestimonials, deleteTestimonial } from "@/lib/api"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Project, Testimonial } from "@/lib/types"
import api from "@/lib/axios"

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({
    leaderName: "",
    companyName: "",
    role: "",
    quote: "",
    projectId: "",
    approved: false,
  })

  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    loadTestimonials()
    loadProjects()
  }, [])

  async function loadTestimonials() {
    try {
      const res = await fetchTestimonials()
      setTestimonials(res.data)
    } catch (err: any) {
      console.log(err.response?.data?.message)
      toast.error(err.response?.data?.message || "Failed to get testimonials")
    } finally {
      setLoading(false)
    }
  }

  async function loadProjects() {
    try {
      const res = await api.get("/projects")
      setProjects(res.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to get projects")
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await deleteTestimonial(id)
      toast.success("Testimonial deleted successfully!")
      loadTestimonials()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete testimonial")
    }
  }

  async function toggleApproval(testimonial: Testimonial) {
    setLoading(true)
    try {
      await api.patch(`/testimonials/${testimonial.id}/approval`, {
        approved: !testimonial.approved,
      })
      toast.success(`Testimonial ${!testimonial.approved ? "approved" : "disapproved"}!`)
      loadTestimonials()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle approval")
    } finally {
      setLoading(false)
    }
  }

  function handleView(testimonial: Testimonial) {
    setViewingTestimonial(testimonial)
    setShowViewModal(true)
  }

  function handleEdit(testimonial: Testimonial) {
    setEditingTestimonial(testimonial)
    setForm({
      leaderName: testimonial.leaderName,
      companyName: testimonial.companyName,
      role: testimonial.role,
      quote: testimonial.quote,
      projectId: testimonial.project.id,
      approved: testimonial.approved,
    })
    setShowEditModal(true)
  }

  async function handleSaveEdit() {
    if (!editingTestimonial) return
    setLoading(true)
    try {
      await api.patch(`/testimonials/${editingTestimonial.id}`, form)
      toast.success("Testimonial updated!")
      loadTestimonials()
      setShowEditModal(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update testimonial")
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveAdd() {
    setLoading(true)
    try {
      await api.post("/testimonials", form)
      toast.success("Testimonial created successfully!")
      loadTestimonials()
      setShowAddModal(false)
      resetForm()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create testimonial")
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({
      leaderName: "",
      companyName: "",
      role: "",
      quote: "",
      projectId: "",
      approved: false,
    })
  }

  function openAddModal() {
    setEditingTestimonial(null)
    resetForm()
    setShowAddModal(true)
  }

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const project = testimonial.project

    const projectId = project ? project.id : null

    // Find the project by its id
    const matchedProject = projects.find((p) => p.id === projectId)

    const projectName = matchedProject ? matchedProject.name : "Unknown Project"

    return (
      testimonial.leaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const totalPages = Math.ceil(filteredTestimonials.length / pageSize)
  const paginatedTestimonials = filteredTestimonials.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AdminLayout
      title="Testimonials Management"
      showAddButton={true}
      onAddClick={openAddModal}
      addButtonText="Add Testimonial"
    >
      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
          />
        </div>
      </motion.div>

      {/* Testimonials Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading testimonials...</p>
            </div>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-20">
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Testimonials Found</h3>
            <p className="text-gray-500 mb-6">No testimonials match your search criteria</p>
          </div>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead className="bg-primary/5 border-b border-gray-200">
              <tr>
                <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">#</th>
                <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Leader</th>
                <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Company</th>
                <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Project</th>
                {/* <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Quote</th> */}
                <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {paginatedTestimonials.map((testimonial, index) => {
                  const project = testimonial.project

                  const projectId = project ? project.id : null

                  const matchedProject = projects.find((p) => p.id === projectId)

                  const projectName = matchedProject ? matchedProject.name : "Unknown Project"

                  return (
                    <motion.tr
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-3 py-1 text-sm text-gray-900">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-1 truncate">
                        <div className="flex items-center gap-3">
                          <Image
                            src={testimonial.leaderImage || "/placeholder.svg?height=40&width=40&query=person"}
                            alt={testimonial.leaderName}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{testimonial.leaderName}</h3>
                           
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-1 truncate">{testimonial.companyName}</td>
                      <td className="px-3 py-1 truncate">{projectName}</td>
                      {/* <td className="px-3 py-1 max-w-xs truncate">{testimonial.quote?.substring(0, 70)}...</td> */}
                      <td className="px-3 py-1">
                        <Badge
                          className={`text-xs cursor-pointer ${
                            testimonial.approved
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                          onClick={() => toggleApproval(testimonial)}
                        >
                          {testimonial.approved ? "Approved" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-3 py-1">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(testimonial)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(testimonial)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(testimonial.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-gray-200"
          >
            Previous
          </Button>
          <span className="text-gray-600 px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-gray-200"
          >
            Next
          </Button>
        </motion.div>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && viewingTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Details */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Testimonial Details</h2>
                <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6 text-center">
                <Image
                  src={viewingTestimonial.leaderImage || "/placeholder.svg?height=150&width=150&query=person"}
                  alt={viewingTestimonial.leaderName}
                  width={150}
                  height={150}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900">{viewingTestimonial.leaderName}</h3>
                <p className="text-gray-600">
                  {viewingTestimonial.role} at {viewingTestimonial.companyName}
                </p>
                <p className="text-lg italic text-gray-800 mt-4">"{viewingTestimonial.quote}"</p>
                <Badge
                  className={`mt-4 text-sm ${
                    viewingTestimonial.approved
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {viewingTestimonial.approved ? "Approved" : "Pending Approval"}
                </Badge>

                <p className="text-xs text-gray-400 mt-1">
                  Sent At :{" "}
                  {new Date(viewingTestimonial.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Edit form */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Testimonial</h2>
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveEdit()
                }}
                className="space-y-6"
              >
                {/* Leader Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leader Name *</label>
                  <Input name="leaderName" value={form.leaderName} onChange={handleChange} required />
                </div>
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <Input name="companyName" value={form.companyName} onChange={handleChange} required />
                </div>
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <Input name="role" value={form.role} onChange={handleChange} required />
                </div>
                {/* Quote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quote *</label>
                  <textarea
                    name="quote"
                    value={form.quote}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                  <select
                    name="projectId"
                    value={form.projectId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 border-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Testimonial Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Testimonial</h2>
                <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveAdd()
                }}
                className="space-y-6"
              >
                {/* Leader Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leader Name *</label>
                  <Input name="leaderName" value={form.leaderName} onChange={handleChange} required />
                </div>
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <Input name="companyName" value={form.companyName} onChange={handleChange} required />
                </div>
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <Input name="role" value={form.role} onChange={handleChange} required />
                </div>
                {/* Quote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quote *</label>
                  <textarea
                    name="quote"
                    value={form.quote}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter the testimonial quote..."
                  />
                </div>
                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                  <select
                    name="projectId"
                    value={form.projectId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Approval Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="approved"
                    name="approved"
                    checked={form.approved}
                    onChange={(e) => setForm((prev) => ({ ...prev, approved: e.target.checked }))}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                  />
                  <label htmlFor="approved" className="text-sm font-medium text-gray-700">
                    Approve testimonial immediately
                  </label>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                    Create Testimonial
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
