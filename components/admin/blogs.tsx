"use client"
import { useState, useEffect } from "react"
import type React from "react"

import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Edit, Trash, X, Search, Plus, Eye, Calendar, User as UserIcon } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { motion, AnimatePresence } from "framer-motion"
import { ErrorMessage } from "../helper/ErrorMessage"

interface Blog {
  id: string
  title: string
  content: string
  image: string
  author: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface FormErrors {
  title?: string
  content?: string
  image?: string
}

interface FormData {
  title: string
  content: string
  image: string
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    image: "",
  })
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Validation rules
  const validateField = (name: string, value: string | File | null): string | undefined => {
    switch (name) {
      case 'title':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Title is required'
        }
        if (typeof value === 'string' && value.trim().length < 3) {
          return 'Title must be at least 3 characters long'
        }
        if (typeof value === 'string' && value.trim().length > 200) {
          return 'Title must be less than 200 characters'
        }
        return undefined

      case 'content':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Content is required'
        }
        // Remove HTML tags for length validation
        const textContent = typeof value === 'string' ? value.replace(/<[^>]*>/g, '').trim() : ''
        if (textContent.length < 10) {
          return 'Content must be at least 10 characters long'
        }
        if (textContent.length > 10000) {
          return 'Content must be less than 10,000 characters'
        }
        return undefined

      case 'image':
        if (value && value instanceof File) {
          // Check file size (5MB limit)
          if (value.size > 5 * 1024 * 1024) {
            return 'Image must be less than 5MB'
          }
          // Check file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
          if (!allowedTypes.includes(value.type)) {
            return 'Only JPEG, PNG, WebP, and GIF images are allowed'
          }
        }
        return undefined

      default:
        return undefined
    }
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validate title
    const titleError = validateField('title', form.title)
    if (titleError) newErrors.title = titleError

    // Validate content
    const contentError = validateField('content', form.content)
    if (contentError) newErrors.content = contentError

    // Validate image
    const imageError = validateField('image', imageFile)
    if (imageError) newErrors.image = imageError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle field blur for real-time validation
  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    let value: string | File | null = null
    if (fieldName === 'title') value = form.title
    else if (fieldName === 'content') value = form.content
    else if (fieldName === 'image') value = imageFile
    
    const error = validateField(fieldName, value)
    setErrors(prev => ({ ...prev, [fieldName]: error }))
  }

  // Handle field change with validation
  const handleFieldChange = (fieldName: string, value: string) => {
    setForm(prev => ({ ...prev, [fieldName]: value }))
    
    // Clear error if field becomes valid
    if (touched[fieldName]) {
      const error = validateField(fieldName, value)
      setErrors(prev => ({ ...prev, [fieldName]: error }))
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    setLoading(true)
    try {
      const res = await api.get("/blogs")
      setBlogs(Array.isArray(res.data.blogs) ? res.data.blogs : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    
    // Validate image immediately
    if (touched.image || file) {
      const error = validateField('image', file)
      setErrors(prev => ({ ...prev, image: error }))
      setTouched(prev => ({ ...prev, image: true }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ title: true, content: true, image: true })
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting")
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", form.title.trim())
      formData.append("content", form.content.trim())

      if (imageFile) {
        formData.append("image", imageFile)
      }

      if (editingBlog) {
        await api.patch(`/blogs/${editingBlog.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Blog updated successfully!")
      } else {
        await api.post("/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Blog created successfully!")
      }
      
      fetchBlogs()
      setShowModal(false)
      resetForm()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save blog")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleView(blog: Blog) {
    setViewingBlog(blog)
    setShowViewModal(true)
  }

  function handleEdit(blog: Blog) {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      content: blog.content,
      image: blog.image,
    })
    setImageFile(null)
    setErrors({})
    setTouched({})
    setShowModal(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    try {
      await api.delete(`/blogs/${id}`)
      toast.success("Blog deleted successfully!")
      fetchBlogs()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete blog")
    }
  }

  function resetForm() {
    setForm({
      title: "",
      content: "",
      image: "",
    })
    setImageFile(null)
    setEditingBlog(null)
    setErrors({})
    setTouched({})
  }

  function openAddModal() {
    resetForm()
    setShowModal(true)
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) 
    return matchesSearch
  })

  const totalPages = Math.ceil(filteredBlogs.length / pageSize)
  const paginatedBlogs = filteredBlogs.slice((page - 1) * pageSize, page * pageSize)


  return (
    <AdminLayout title="Blog Management" showAddButton={true} onAddClick={openAddModal} addButtonText="Add Blog Post">
      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
          />
        </div>
      </motion.div>

      {/* Blogs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No blog posts match your search" : "Create your first blog post"}
            </p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Blog Post
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary/5">
                <tr>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Blog Post
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedBlogs.map((blog, index) => (
                    <motion.tr
                      key={blog.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-900">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-3 py-1 text-sm text-gray-900">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-900 truncate">{blog.title}</p>
                          <div
                            className="text-gray-600 text-xs mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: blog?.content.substring(0, 100) + "..." }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-1 whitespace-nowrap">
                        {blog.image ? (
                          <img
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-1 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(blog)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(blog)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(blog.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash className="w-4 h-4 mr-1" />
                            Delete
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-3 py-1 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredBlogs.length)} of{" "}
                {filteredBlogs.length} results
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
            </div>
          </div>
        )}
      </motion.div>

      {/* View Blog Modal */}
      <AnimatePresence>
        {showViewModal && viewingBlog && (
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden"
            >
              {/* Header with Featured Image */}
              {viewingBlog.image && (
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img src={viewingBlog.image} alt={viewingBlog.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="px-6 sm:px-8 py-6 max-h-[calc(90vh-300px)] overflow-y-auto">
                {/* Title and Meta */}
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{viewingBlog.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{viewingBlog.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <span>{new Date(viewingBlog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-2xl p-6 border border-gray-200">
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: viewingBlog.content }} />
                </div>
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
                      handleEdit(viewingBlog)
                    }}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Blog Post
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
                  {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    onBlur={() => handleFieldBlur('title')}
                    placeholder="Enter blog title..."
                    className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                      errors.title ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.title} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className={`${errors.content ? 'ring-1 ring-red-300 rounded-md' : ''}`}>
                    <RichTextEditor
                      value={form.content}
                      onChange={(val) => handleFieldChange('content', val)}
                      onBlur={() => handleFieldBlur('content')}
                      placeholder="Write your blog content..."
                    />
                  </div>
                  <ErrorMessage error={errors.content} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                  <Input
                    type="file"
                    onChange={handleImageChange}
                    onBlur={() => handleFieldBlur('image')}
                    accept="image/*"
                    className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                      errors.image ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                  />
                  <ErrorMessage error={errors.image} />
                  <div className="text-xs text-gray-500 mt-1">
                    Supported formats: JPEG, PNG, WebP, GIF. Maximum size: 5MB
                  </div>
                  
                  {imageFile && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                        alt="Featured Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {editingBlog && !imageFile && form.image && (
                    <div className="mt-2">
                      <img
                        src={form.image || "/placeholder.svg"}
                        alt="Current Featured Image"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {editingBlog ? "Updating..." : "Submitting..."}
                      </div>
                    ) : (
                      editingBlog ? "Update Blog Post" : "Create Blog Post"
                    )}
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