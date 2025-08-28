"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Search, Edit, Trash2, Plus, Tag, MessageCircle, X, Eye } from "lucide-react"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { motion, AnimatePresence } from "framer-motion"

interface Faq {
  id: string
  category: string
  question: string
  answer: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [viewingFaq, setViewingFaq] = useState<Faq | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    answer: "",
    tags: [""],
  })
    const [isSubmitting, setIsSubmitting] = useState(false)

  const pageSize = 10
  const categories = ["General", "Services", "Pricing", "Technical", "Support", "Billing"]

  useEffect(() => {
    fetchFaqs()
  }, [])

  async function fetchFaqs() {
    try {
      const res = await api.get("/faqs")
      setFaqs(res.data)
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch FAQs")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setIsSubmitting(true)

      const cleanedData = {
        ...formData,
        tags: formData.tags.filter((tag) => tag.trim()),
      }

      if (editingFaq) {
        await api.patch(`/faqs/${editingFaq.id}`, cleanedData)
        toast.success("FAQ updated successfully!")
      } else {
        await api.post("/faqs", cleanedData)
        toast.success("FAQ created successfully!")
      }

      setShowModal(false)
      setEditingFaq(null)
      resetForm()
      fetchFaqs()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save FAQ")
    }
    finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(faq: Faq) {
    setEditingFaq(faq)
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      tags: faq.tags.length ? faq.tags : [""],
    })
    setShowModal(true)
  }

  function handleView(faq: Faq) {
    setViewingFaq(faq)
    setShowViewModal(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return

    try {
      await api.delete(`/faqs/${id}`)
      toast.success("FAQ deleted successfully!")
      fetchFaqs()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete FAQ")
    }
  }

  function resetForm() {
    setFormData({
      category: "",
      question: "",
      answer: "",
      tags: [""],
    })
  }

  function openAddModal() {
    setEditingFaq(null)
    resetForm()
    setShowModal(true)
  }

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }))
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const updateTag = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }))
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || faq.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredFaqs.length / pageSize)
  const paginatedFaqs = filteredFaqs.slice((page - 1) * pageSize, page * pageSize)

  const getCategoryColor = (category: string) => {
    const colors = {
      General: "bg-blue-100 text-blue-800 border-blue-200",
      Services: "bg-green-100 text-green-800 border-green-200",
      Pricing: "bg-purple-100 text-purple-800 border-purple-200",
      Technical: "bg-orange-100 text-orange-800 border-orange-200",
      Support: "bg-pink-100 text-pink-800 border-pink-200",
      Billing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <AdminLayout title="FAQ Management" showAddButton={true} onAddClick={openAddModal} addButtonText="Add FAQ">
      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search FAQs by question, answer, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[180px]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* FAQs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading FAQs...</p>
            </div>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Found</h3>
            <p className="text-gray-500 mb-6">No FAQs match your search criteria</p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First FAQ
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Question</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Tags</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedFaqs.map((faq, index) => (
                    <motion.tr
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-3 py-1 text-sm text-gray-900">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-1 truncate">
                        <div className="max-w-md">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{faq.question}</h3>
                          {/* <p
                            className="text-xs text-gray-600 mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: faq.answer.substring(0, 100) + "..." }}
                          /> */}
                        </div>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <Badge className={`${getCategoryColor(faq.category)} border text-xs`}>{faq.category}</Badge>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <div className="flex flex-wrap gap-1 truncate">
                          {faq.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs truncate">
                              {tag}
                            </Badge>
                          ))}
                          {faq.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs truncate">
                              +{faq.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <div className="text-sm text-gray-600 truncate">
                          {new Date(faq.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(faq)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(faq)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(faq.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
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
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredFaqs.length)} of{" "}
            {filteredFaqs.length} results
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

      {/* View FAQ Modal */}
      <AnimatePresence>
        {showViewModal && viewingFaq && (
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
                <h2 className="text-2xl font-bold text-gray-900">FAQ Details</h2>
                <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className={`${getCategoryColor(viewingFaq.category)} border`}>{viewingFaq.category}</Badge>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(viewingFaq.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Question
                  </h3>
                  <p className="text-gray-700">{viewingFaq.question}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Answer</h3>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: viewingFaq.answer }} />
                </div>

                {viewingFaq.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingFaq.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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
                <h2 className="text-2xl font-bold text-gray-900">{editingFaq ? "Edit FAQ" : "Add New FAQ"}</h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                  <Input
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the frequently asked question..."
                    className="border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
                  <RichTextEditor
                    value={formData.answer}
                    onChange={(val) => setFormData({ ...formData, answer: val })}
                    placeholder="Write a detailed answer..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="space-y-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={tag}
                          onChange={(e) => updateTag(index, e.target.value)}
                          placeholder="Enter tag..."
                          className="flex-1 border-gray-200 focus:border-primary focus:ring-primary/20"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTag(index)}
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
                      onClick={addTag}
                      className="border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                					{isSubmitting ? (
					  <div className="flex items-center justify-center gap-2">
						<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						{editingFaq ? "Updating..." : "Submitting..."}
					  </div>
					) : (
					  editingFaq ? "Save" : "Save"
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
