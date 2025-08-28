"use client"
import { useState, useEffect } from "react"
import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Search, Eye, Check, X, User, Mail, Phone, FileText, Calendar, Briefcase, Download } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import api from "@/lib/axios"
import PDFViewer from "../PDFViewer"


interface JobApplication {
  id: string
  fullName: string
  email: string
  phone: string
  resume: string
  coverLetter?: string
  status: "pending" | "rejected" | "successful"
  createdAt: string
  updatedAt: string
  job: {
    id: string
    title: string
    department: string
    location: string
    type: string
  }
}

export default function AdminJobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [pdfTitle, setPdfTitle] = useState("")

  const pageSize = 10

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    try {
      const res = await api.get("/job-applications")
      setApplications(res.data)
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch applications")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(applicationId: string, status: "pending" | "rejected" | "successful") {
    try {
      await api.patch(`/job-applications/${applicationId}/status`, { status })
      
      setApplications(applications.map(app => 
        app.id === applicationId 
          ? { ...app, status, updatedAt: new Date().toISOString() }
          : app
      ))
      
      toast.success(`Application ${status === "successful" ? "approved" : status}!`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update application")
    }
  }

  function handleView(application: JobApplication) {
    setViewingApplication(application)
    setShowViewModal(true)
  }

  function handleViewPDF(url: string, title: string) {
    setPdfUrl(url)
    setPdfTitle(title)
    setShowPDFModal(true)
  }

  function handleDownload(url: string, filename: string) {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get unique jobs
  const jobs = ["all", ...Array.from(new Set(applications.map(app => app.job.title)))]

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesJob = jobFilter === "all" || app.job.title === jobFilter
    return matchesSearch && matchesStatus && matchesJob
  })

  const totalPages = Math.ceil(filteredApplications.length / pageSize)
  const paginatedApplications = filteredApplications.slice((page - 1) * pageSize, page * pageSize)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <AdminLayout title="Job Applications" showAddButton={false}>
      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search applications by name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="successful">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[200px]"
          >
            <option value="all">All Jobs</option>
            {jobs.slice(1).map(job => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Applications Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-500">No applications match your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Applicant</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Job Position</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedApplications.map((application, index) => (
                    <motion.tr
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200 h-12"
                    >
                      <td className="px-3 py-1 text-sm text-gray-900">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-1 truncate">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{application.fullName}</div>
                          {/* <div className="text-sm text-gray-500">{application.email}</div>
                          <div className="text-sm text-gray-500">{application.phone}</div> */}
                        </div>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{application.job.title}</div>
                          {/* <div className="text-sm text-gray-500">{application.job.department}</div> */}
                         
                        </div>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <Badge className={`${getStatusColor(application.status)} border text-xs`}>
                          {application.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-1 truncate">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(application.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                   
                      <td className="px-3 py-1">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(application)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {application.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(application.id, "successful")}
                                className="border-green-200 text-green-600 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(application.id, "rejected")}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredApplications.length)} of{" "}
            {filteredApplications.length} results
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

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {showPDFModal && (
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
              className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{pdfTitle}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(pdfUrl, pdfTitle)}
                    className="border-gray-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPDFModal(false)}
                    className="border-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="h-[calc(90vh-120px)]">
                <PDFViewer url={pdfUrl} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Application Modal */}
      <AnimatePresence>
        {showViewModal && viewingApplication && (
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
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Applicant Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Applicant Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900">{viewingApplication.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          {viewingApplication.email}
                          <a href={`mailto:${viewingApplication.email}`} className="text-primary hover:text-primary/80">
                            <Mail className="w-4 h-4" />
                          </a>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          {viewingApplication.phone}
                          <a href={`tel:${viewingApplication.phone}`} className="text-primary hover:text-primary/80">
                            <Phone className="w-4 h-4" />
                          </a>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Applied On</label>
                        <p className="text-gray-900">{new Date(viewingApplication.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Job Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Position</label>
                        <p className="text-gray-900">{viewingApplication.job.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-gray-900">{viewingApplication.job.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="text-gray-900">{viewingApplication.job.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Type</label>
                        <p className="text-gray-900">{viewingApplication.job.type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documents
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Resume/CV</p>
                            <p className="text-sm text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              handleViewPDF(viewingApplication.resume, `${viewingApplication.fullName} - Resume`);
                              setShowViewModal(false);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                  
                        </div>
                      </div>
                    </div>

                    {viewingApplication.coverLetter && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Cover Letter</p>
                              <p className="text-sm text-gray-500">PDF Document</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                handleViewPDF(viewingApplication.coverLetter!, `${viewingApplication.fullName} - Cover Letter`)
                                setShowViewModal(false)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
                  
                  <div className="flex items-center gap-4">
                    <Badge className={`${getStatusColor(viewingApplication.status)} border text-sm px-3 py-1`}>
                      {viewingApplication.status}
                    </Badge>
                    
                    {viewingApplication.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            handleStatusChange(viewingApplication.id, "successful")
                            setShowViewModal(false)
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            handleStatusChange(viewingApplication.id, "rejected")
                            setShowViewModal(false)
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
