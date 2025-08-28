"use client"
import { useState, useEffect } from "react"

import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Eye, X, Search, CheckCircle, XCircle, Building, Calendar, MessageSquare } from "lucide-react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  subject: string
  serviceInterest: string
  message: string
  responded: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const services = ["Construction", "Cleaning Services", "Landscaping", "Maintenance", "Consultation"]

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    try {
      const res = await api.get("/contact-messages")
      setMessages(res.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleResponded(id: string, responded: boolean) {
    setUpdating(id)
    try {
      await api.patch(`/contact-messages/${id}`, { responded: !responded })
      setMessages((msgs) => msgs.map((msg) => (msg.id === id ? { ...msg, responded: !responded } : msg)))
      toast.success(`Message marked as ${!responded ? "responded" : "not responded"}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update message status")
    } finally {
      setUpdating(null)
    }
  }

  function handleViewMessage(message: ContactMessage) {
    setSelectedMessage(message)
    setShowModal(true)
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "responded" && message.responded) ||
      (statusFilter === "not_responded" && !message.responded)
    const matchesService = serviceFilter === "all" || message.serviceInterest === serviceFilter
    return matchesSearch && matchesStatus && matchesService
  })

  const totalPages = Math.ceil(filteredMessages.length / pageSize)
  const paginatedMessages = filteredMessages.slice((page - 1) * pageSize, page * pageSize)

  const getStatusColor = (responded: boolean) => {
    return responded ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
  }

  const getServiceColor = (service: string) => {
    const colors = {
      Construction: "bg-blue-100 text-blue-800 border-blue-200",
      "Cleaning Services": "bg-green-100 text-green-800 border-green-200",
      Landscaping: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Maintenance: "bg-orange-100 text-orange-800 border-orange-200",
      Consultation: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[service as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <AdminLayout title="Contact Messages">
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 text-gray-900 rounded-lg focus:border-primary focus:ring-primary/20 min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="responded">Responded</option>
          <option value="not_responded">Not Responded</option>
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 text-gray-900 rounded-lg focus:border-primary focus:ring-primary/20 min-w-[180px]"
        >
          <option value="all">All Services</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Messages Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading contact messages...</p>
            </div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No messages match your search" : "No contact messages yet"}
            </p>
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
                    Contact Info
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Service Interest
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-1 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedMessages.map((message, index) => (
                    <motion.tr
                      key={message.id}
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
                        <div>
                          <p className="font-semibold text-gray-900 truncate">{message.name}</p>
                          {/* <div className="flex items-center gap-2 text-gray-600 text-xs mt-1">
                            <Mail className="w-3 h-3" />
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-2 text-gray-600 text-xs mt-1">
                              <Phone className="w-3 h-3" />
                              {message.phone}
                            </div>
                          )} */}
                        </div>
                      </td>
                      <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          {message.company}
                        </div>
                      </td>
                      <td className="px-3 py-1 whitespace-nowrap">
                        <Badge className={`${getServiceColor(message.serviceInterest)} border text-xs`}>
                          {message.serviceInterest}
                        </Badge>
                      </td>
                      <td className="px-3 py-1 text-sm text-gray-900">
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{message.subject}</p>
                       
                        </div>
                      </td>
                      <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(message.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
                        </div>
                      </td>
                      <td className="px-3 py-1 whitespace-nowrap">
                        <Badge className={`${getStatusColor(message.responded)} border text-xs`}>
                          {message.responded ? "Responded" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-3 py-1 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewMessage(message)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleResponded(message.id, message.responded)}
                            disabled={updating === message.id}
                            className={`${
                              message.responded
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {updating === message.id ? (
                              <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
                            ) : message.responded ? (
                              <XCircle className="w-4 h-4 mr-1" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            {message.responded ? "Unmark" : "Mark"}
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
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredMessages.length)} of{" "}
                {filteredMessages.length} results
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

      {/* Message Detail Modal */}
      <AnimatePresence>
        {showModal && selectedMessage && (
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
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Contact Message Details
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900 font-semibold">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <p className="text-gray-900">{selectedMessage.company}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedMessage.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Interest</label>
                    <Badge className={`${getServiceColor(selectedMessage.serviceInterest)} border`}>
                      {selectedMessage.serviceInterest}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Badge className={`${getStatusColor(selectedMessage.responded)} border`}>
                      {selectedMessage.responded ? "Responded" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900 font-semibold">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-line">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Received on {new Date(selectedMessage.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at{" "}
                    {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                  </p>
                  <Button
                    onClick={() => handleToggleResponded(selectedMessage.id, selectedMessage.responded)}
                    disabled={updating === selectedMessage.id}
                    className={`${
                      selectedMessage.responded ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {updating === selectedMessage.id ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    ) : selectedMessage.responded ? (
                      <XCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {selectedMessage.responded ? "Mark as Not Responded" : "Mark as Responded"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
