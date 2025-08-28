"use client"
import { useState, useEffect } from "react"
import type React from "react"

import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tag, Edit, Trash, X, Search, Plus } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ProjectCategory {
  id: string
  name: string
  projects?: { id: string }[]
  createdAt: string
}

export default function AdminProjectCategories() {
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({
    name: "",
  })
    const [isSubmitting, setIsSubmitting] = useState(false)

  const pageSize = 10

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const res = await api.get("/projects/categories")
      setCategories(res.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      if (editingCategory) {
        await api.patch(`/projects/categories/${editingCategory.id}`, form)
        toast.success("Category updated successfully!")
      } else {
        await api.post("/projects/categories", form)
        toast.success("Category created successfully!")
      }
      fetchCategories()
      setShowModal(false)
      resetForm()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save category")
    }finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(category: ProjectCategory) {
    setEditingCategory(category)
    setForm({
      name: category.name,
    })
    setShowModal(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category? This will affect all projects using this category."))
      return
    try {
      await api.delete(`/projects/categories/${id}`)
      toast.success("Category deleted successfully!")
      fetchCategories()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category")
    }
  }

  function resetForm() {
    setForm({ name: "" })
    setEditingCategory(null)
  }

  function openAddModal() {
    resetForm()
    setShowModal(true)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCategories.length / pageSize)
  const paginatedCategories = filteredCategories.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AdminLayout title="Project Categories" showAddButton={true} onAddClick={openAddModal} addButtonText="Add Category">
      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
          />
        </div>
      </motion.div>

      {/* Categories Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No categories match your search" : "Create your first project category"}
            </p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Category
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Category Name</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Projects Count</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedCategories.map((category, index) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-3 py-1 text-sm text-gray-900">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-1 truncate" >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                            <Tag className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <Badge variant="secondary" className="text-xs">
                          {category.projects?.length || 0} projects
                        </Badge>
                      </td>
              
                      <td className="px-3 py-1 truncate">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(category.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash className="w-4 h-4" />
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
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredCategories.length)} of{" "}
            {filteredCategories.length} results
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
              className="bg-white rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter category name..."
                    className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                
							<Button
					type="submit"
					disabled={isSubmitting}
					className="flex-1 bg-primary hover:bg-primary/90 text-white"
				  >
					{isSubmitting ? (
					  <div className="flex items-center justify-center gap-2">
						<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						{editingCategory ? "Updating..." : "Submitting..."}
					  </div>
					) : (
					  editingCategory ? "Save" : "Save"
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
