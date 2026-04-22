"use client"
import { useState, useEffect } from "react"
import type React from "react"

import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Edit, Trash, X, Search, Plus, MapPin, Calendar, ImageIcon, Eye, LinkIcon, FileText } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { motion, AnimatePresence } from "framer-motion"

interface Project {
  id: string
  name: string
  description: string
  category: Category
  imageAfter: string
  // imageBefore: string
  gallery: string[]
  location: string
  createdAt: string
}

interface Category {
  id: string
  name: string
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [imageAfterFile, setImageAfterFile] = useState<File | null>(null)
  // const [imageBeforeFile, setImageBeforeFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    imageAfter: "",
    // imageBefore: "",
    gallery: [] as string[],
  })
  
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    fetchProjects()
    fetchCategories()
  }, [])

  async function fetchProjects() {
    try {
      const res = await api.get("/projects")
      setProjects(res.data)
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await api.get("/projects/categories")
      setCategories(res.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch categories")
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleImageAfterChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImageAfterFile(e.target.files[0])
    }
  }

  // function handleImageBeforeChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   if (e.target.files && e.target.files[0]) {
  //     setImageBeforeFile(e.target.files[0])
  //   }
  // }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setGalleryFiles(files)
      console.log(
        `Selected ${files.length} gallery files:`,
        files.map((f) => f.name),
      )
    }
  }

  function removeGalleryFile(index: number) {
    const newFiles = galleryFiles.filter((_, i) => i !== index)
    setGalleryFiles(newFiles)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("description", form.description)
      formData.append("category", form.category)
      formData.append("location", form.location)

      if (imageAfterFile) {
        formData.append("imageAfter", imageAfterFile)
        console.log("Added imageAfter file:", imageAfterFile.name)
      }

      // if (imageBeforeFile) {
      //   formData.append("imageBefore", imageBeforeFile)
      // }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file, index) => {
          formData.append("gallery", file)
          console.log(`Added gallery file ${index + 1}:`, file.name)
        })
        console.log(`Total gallery files added: ${galleryFiles.length}`)
      }

      // Log FormData contents for debugging
      console.log("FormData contents:")
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.size} bytes)`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      let response
      if (editingProject) {
        response = await api.patch(`/projects/${editingProject.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Project updated successfully!")
      } else {
        response = await api.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Project created successfully!")
      }

      console.log("Server response:", response.data)
      fetchProjects()
      setShowModal(false)
      resetForm()
    } catch (err: any) {
      console.error("Upload error:", err.response?.data || err.message)
      toast.error(err.response?.data?.message || "Failed to save project")
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project)
    setForm({
      name: project.name,
      description: project.description,
      category: project?.category?.id,
      location: project.location,
      imageAfter: project.imageAfter,
      // imageBefore: project.imageBefore,
      gallery: project.gallery,
    })
    setImageAfterFile(null)
    // setImageBeforeFile(null)
    setGalleryFiles([])
    setShowModal(true)
  }

  function handleView(project: Project) {
    setViewingProject(project)
    setShowViewModal(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success("Project deleted successfully!")
      fetchProjects()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete project")
    }
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      category: categories[0]?.id || "",
      location: "",
      imageAfter: "",
      // imageBefore: "",
      gallery: [],
    })
    setImageAfterFile(null)
    // setImageBeforeFile(null)
    setGalleryFiles([])
    setEditingProject(null)
  }

  function openAddModal() {
    resetForm()
    setShowModal(true)
  }

  const handleGenerateTestimonialLink = (projectId: string) => {
    const link = `${window.location.origin}/submit-testimonial/project?id=${projectId}`
    navigator.clipboard.writeText(link)
    toast.success("Testimonial link copied to clipboard!")
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || project.category.id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProjects.length / pageSize)
  const paginatedProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize)

  const getCategoryColor = (categoryName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-pink-100 text-pink-800 border-pink-200",
    ]
    const index = categoryName?.length % colors?.length
    return colors[index]
  }

  return (
    <AdminLayout title="Projects Management" showAddButton={true} onAddClick={openAddModal} addButtonText="Add Project">
      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search projects by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 text-gray-900 rounded-lg focus:border-primary focus:ring-primary/20 min-w-[200px]"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category?.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Projects Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-500 mb-6">No projects match your search criteria</p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Project
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Project</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Gallery</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedProjects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-3 py-1 text-sm text-gray-900">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-1 truncate">
                        <div className="flex items-center gap-3">
                          {project.imageAfter ? (
                            <img
                              src={project.imageAfter || "/placeholder.svg"}
                              alt={project.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                            <p className="text-xs text-gray-600 line-clamp-1 max-w-xs">
                              {project.description.replace(/<[^>]*>/g, "")?.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-1">
                        <Badge className={`${getCategoryColor(project?.category?.name)} border text-xs`}>
                          {project?.category?.name}
                        </Badge>
                      </td>
                      <td className="px-3 py-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 truncate">{project.location}</span>
                        </div>
                      </td>
                    
                      <td className="px-3 py-1">
                        <div className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">{project.gallery.length}</span>
                        </div>
                      </td>
                      <td className="px-3 py-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600 truncate">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
                        </div>
                      </td>
                      <td className="px-3 py-1">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(project)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(project)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(project.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateTestimonialLink(project.id)}
                            className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            title="Generate Testimonial Link"
                          >
                            <LinkIcon className="w-4 h-4" />
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

      {/* View Project Modal */}
      <AnimatePresence>
        {showViewModal && viewingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8 overflow-hidden"
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
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{viewingProject.name}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={`${getCategoryColor(viewingProject?.category?.name)} border-0 shadow-sm`}>
                        {viewingProject?.category?.name}
                      </Badge>
                      <div className="flex items-center gap-1 text-white/90 text-sm">
                        <MapPin className="w-4 h-4" />
                        {viewingProject.location}
                      </div>
                      <div className="flex items-center gap-1 text-white/90 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(viewingProject.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Featured Image */}
                {viewingProject.imageAfter && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Featured Image
                    </h3>
                    <img
                      src={viewingProject.imageAfter}
                      alt={viewingProject.name}
                      className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Project Description
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border border-gray-100">
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: viewingProject.description }} />
                  </div>
                </div>

                {/* Gallery */}
                {viewingProject.gallery.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 sm:p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Project Gallery ({viewingProject.gallery.length} images)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {viewingProject.gallery.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors" />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs px-2 py-1 rounded-lg font-medium">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
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
                      handleEdit(viewingProject)
                    }}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Project Modal */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter project name..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <Input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Enter project location..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    {categories.length === 0 ? (
                      <div className="text-red-500 text-sm">No categories found. Please add a category first.</div>
                    ) : (
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <RichTextEditor
                    value={form.description}
                    onChange={(val) => setForm((f) => ({ ...f, description: val }))}
                    placeholder="Describe your project..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Before Image *</label>
                    <Input
                      type="file"
                      onChange={handleImageBeforeChange}
                      accept="image/*"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                      required
                    />
                    {imageBeforeFile && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(imageBeforeFile) || "/placeholder.svg"}
                          alt="Before Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">After Image *</label>
                    <Input
                      type="file"
                      onChange={handleImageAfterChange}
                      accept="image/*"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                       required={!editingProject}
                    />
                    {imageAfterFile && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(imageAfterFile) || "/placeholder.svg"}
                          alt="After Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images (Multiple files supported) *
                  </label>
                  <Input
                    type="file"
                    onChange={handleGalleryChange}
                    accept="image/*"
                    multiple
                    className="border-gray-200 focus:border-primary focus:ring-primary/20"
                 required={!editingProject}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select multiple images to create a project gallery. Supported formats: JPG, PNG, WebP (Max 10 files)
                  </p>

                  {galleryFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Images ({galleryFiles.length}):</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {galleryFiles.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={`Gallery Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGalleryFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingProject && editingProject.gallery.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Current Gallery Images ({editingProject.gallery.length}):
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {editingProject.gallery.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Current Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Current
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Upload new images to replace the current gallery</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                    {loading
                      ? editingProject
                        ? "Updating..."
                        : "Creating..."
                      : editingProject
                        ? "Update Project"
                        : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
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
