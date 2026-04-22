"use client"
import { useState, useEffect } from "react"

import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Eye, X, Search, CheckCircle, XCircle, Building, Calendar, MessageSquare, User, Phone, Briefcase, Clock } from "lucide-react"
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
      await api.patch(`/contact-messages/${id}/responded`, { responded: !responded })
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
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 sm:px-8 py-6 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={`${getStatusColor(selectedMessage.responded)} border-0 shadow-sm`}>
                        {selectedMessage.responded ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Responded</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                      <Badge className={`${getServiceColor(selectedMessage.serviceInterest)} border-0 shadow-sm`}>
                        <Briefcase className="w-3 h-3 mr-1" />
                        {selectedMessage.serviceInterest}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Contact Information Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 sm:p-6 mb-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{selectedMessage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Email Address</p>
                        <a href={`mailto:${selectedMessage.email}`} className="text-sm font-medium text-purple-600 hover:text-purple-700 truncate block">
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                        <p className="text-sm font-medium text-gray-900">{selectedMessage.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Building className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Company</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{selectedMessage.company}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message Content
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border border-gray-100">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Timestamp Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Received on</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedMessage.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {new Date(selectedMessage.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 sm:px-8 py-5 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="border-gray-300 hover:bg-gray-100 order-2 sm:order-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleToggleResponded(selectedMessage.id, selectedMessage.responded)
                      setSelectedMessage({ ...selectedMessage, responded: !selectedMessage.responded })
                    }}
                    disabled={updating === selectedMessage.id}
                    className={`${
                      selectedMessage.responded
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white shadow-lg order-1 sm:order-2`}
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
