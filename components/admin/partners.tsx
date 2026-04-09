"use client"
import { useState, useEffect } from "react"
import type React from "react"

import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Handshake, Edit, Trash, X, Search, Plus, Calendar, Eye } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

interface Partner {
  id: string
  name: string
  image: string
  createdAt: string
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [form, setForm] = useState({
    name: "",
    image: "",
  })
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchPartners()
  }, [])

  async function fetchPartners() {
    setLoading(true)
    try {
      const res = await api.get("/partners")
      setPartners(res.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch partners")
    } finally {
      setLoading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("name", form.name)

      if (imageFile) {
        formData.append("image", imageFile)
      }

      if (editingPartner) {
        await api.patch(`/partners/${editingPartner.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Partner updated successfully!")
      } else {
        await api.post("/partners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Partner created successfully!")
      }
      fetchPartners()
      setShowModal(false)
      resetForm()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save partner")
    }finally {
      setIsSubmitting(false)
    }
  }

  function handleView(partner: Partner) {
    setViewingPartner(partner)
    setShowViewModal(true)
  }

  function handleEdit(partner: Partner) {
    setEditingPartner(partner)
    setForm({
      name: partner.name,
      image: partner.image,
    })
    setImageFile(null)
    setShowModal(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this partner?")) return
    try {
      await api.delete(`/partners/${id}`)
      toast.success("Partner deleted successfully!")
      fetchPartners()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete partner")
    }
  }

  function resetForm() {
    setForm({ name: "", image: "" })
    setImageFile(null)
    setEditingPartner(null)
  }

  function openAddModal() {
    resetForm()
    setShowModal(true)
  }

  const filteredPartners = partners.filter((partner) => partner.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalPages = Math.ceil(filteredPartners.length / pageSize)
  const paginatedPartners = filteredPartners.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AdminLayout title="Partners Management" showAddButton={true} onAddClick={openAddModal} addButtonText="Add Partner">
      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
          />
        </div>
      </motion.div>

      {/* Partners Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading partners...</p>
            </div>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-20">
            <Handshake className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Partners Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No partners match your search" : "Add your first business partner"}
            </p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Partner
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Partner</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Logo</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Added</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedPartners.map((partner, index) => (
                    <motion.tr
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-3 py-1 text-sm text-gray-900">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                            <Handshake className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{partner.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-1">
                        {partner.image ? (
                          <img
                            src={partner.image || "/placeholder.svg"}
                            alt={partner.name}
                            className="w-16 h-12 object-contain bg-gray-50 rounded-lg p-1"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Handshake className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-1 truncate">
                        <div className="flex items-center gap-1 text-sm text-gray-600 ">
                          <Calendar className="w-4 h-4" />
                          {new Date(partner.createdAt).toLocaleDateString("en-US", {
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
                            onClick={() => handleView(partner)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(partner)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(partner.id)}
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
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredPartners.length)} of{" "}
            {filteredPartners.length} results
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

      {/* View Partner Modal */}
      <AnimatePresence>
        {showViewModal && viewingPartner && (
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
                <h2 className="text-2xl font-bold text-gray-900">Partner Details</h2>
                <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4 text-center">
                {viewingPartner.image ? (
                  <img src={viewingPartner.image} alt={viewingPartner.name} className="h-32 w-auto object-contain mx-auto bg-gray-50 rounded-xl p-4" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                    <Handshake className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{viewingPartner.name}</h3>
                <p className="text-sm text-gray-500">
                  Added: {new Date(viewingPartner.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
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
              className="bg-white rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPartner ? "Edit Partner" : "Add New Partner"}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter partner name..."
                    className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partner Logo *</label>
                  <Input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    required={!editingPartner}
                  />
                  {imageFile && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                        alt="Partner Preview"
                        className="w-full h-32 object-contain bg-gray-50 rounded-lg p-2"
                      />
                    </div>
                  )}
                  {editingPartner && !imageFile && form.image && (
                    <div className="mt-2">
                      <img
                        src={form.image || "/placeholder.svg"}
                        alt="Current Partner Logo"
                        className="w-full h-32 object-contain bg-gray-50 rounded-lg p-2"
                      />
                    </div>
                  )}
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
                          {editingPartner ? "Updating..." : "Submitting..."}
                        </div>
                      ) : (
                        editingPartner ? "Save" : "Save"
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
