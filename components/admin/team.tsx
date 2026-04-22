"use client"
import { useState, useEffect } from "react"
import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import {
  Search,
  Edit,
  Trash2,
  Plus,
  GripVertical,
  ExternalLink,
  X,
  User,
  Calendar,
  Linkedin,
  Eye,
  Briefcase,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/lib/axios"
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided } from "@hello-pangea/dnd";

interface TeamMember {
  id: string
  name: string
  position: string
  image: string

  linkedin: string
  order: number
  createdAt: string
}

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
 const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
 
    linkedin: "",
    image: "",
  })

  const pageSize = 10

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  async function fetchTeamMembers() {
    try {
      const res = await api.get("/team")
      setTeamMembers(res.data.sort((a: TeamMember, b: TeamMember) => a.order - b.order))
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch team members")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setIsSubmitting(true)

      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("position", formData.position)
 
      formDataToSend.append("linkedin", formData.linkedin)

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      if (editingMember) {
        await api.patch(`/team/${editingMember.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Team member updated successfully!")
      } else {
        await api.post("/team", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Team member created successfully!")
      }
      setShowModal(false)
      setEditingMember(null)
      resetForm()
      fetchTeamMembers()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save team member")
    }finally {
      setIsSubmitting(false)
    }
  }

  function handleView(member: TeamMember) {
    setViewingMember(member)
    setShowViewModal(true)
  }

  function handleEdit(member: TeamMember) {
    setEditingMember(member)
    setFormData({
      name: member.name,
      position: member.position,
      linkedin: member.linkedin,
      image: member.image,
    })
    setImageFile(null)
    setShowModal(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this team member?")) return
    try {
      await api.delete(`/team/${id}`)
      toast.success("Team member deleted successfully!")
      fetchTeamMembers()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete team member")
    }
  }

  async function handleReorder(result: DropResult) {
		if (!result.destination) return;
		const sourceIndex = result.source.index;
		const destIndex = result.destination.index;
		if (sourceIndex === destIndex) return;
		const newTeam = Array.from(sortedTeam);
		const [removed] = newTeam.splice(sourceIndex, 1);
		newTeam.splice(destIndex, 0, removed);
		const memberIds = newTeam.map((m) => m.id);
    try{
      await api.post("/team/reorder", { memberIds })
      toast.success("Team order updated successfully!")
      fetchTeamMembers() // Revert on error

    } catch (err: any) {
      toast.error("Failed to update team order")
      fetchTeamMembers() // Revert on error
    }
   
  }

  function resetForm() {
    setFormData({
      name: "",
      position: "",
      linkedin: "",
      image: "",
    })
    setImageFile(null)
  }

  function openAddModal() {
    setEditingMember(null)
    resetForm()
    setShowModal(true)
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase())
  )
	const sortedTeam = [...filteredMembers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const totalPages = Math.ceil(filteredMembers.length / pageSize)
  const paginatedMembers = filteredMembers.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AdminLayout title="Team Management" showAddButton={true} onAddClick={openAddModal} addButtonText="Add Member">
      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
          />
        </div>
      </motion.div>

      {/* Team Table */}
     
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading team members...</p>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Team Members Found</h3>
            <p className="text-gray-500 mb-6">No team members match your search criteria</p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </div>
        ) : (
         					<DragDropContext onDragEnd={handleReorder}>
						<Droppable droppableId="team-table">
							{(provided: DroppableProvided) => (
								<div ref={provided.innerRef} {...provided.droppableProps} className="overflow-y-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Order</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Member</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Position</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">LinkedIn</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Added</th>
                  <th className="px-3 py-1 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
             
                    {paginatedMembers.map((member, index) => (
												<Draggable key={member.id} draggableId={member.id} index={index}>
													{(provided: DraggableProvided, snapshot) => (
                   	<tr
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
                        className={`hover:bg-primary/5 transition-colors duration-200 cursor-move ${snapshot.isDragging ? "bg-sky-100" : ""}`}
                      >
                        <td className="px-3 py-1">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <Badge className="bg-primary/10 text-primary border-primary/20">#{member.order}</Badge>
                          </div>
                        </td>
                        <td className="px-3 py-1 truncate">
                          <div className="flex items-center gap-3">
                            {member.image ? (
                              <img
                                src={member.image || "/placeholder.svg"}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
                             
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-1 truncate">
                          <span className="text-sm font-medium text-gray-900">{member.position}</span>
                        </td>
                    
                      
                        <td className="px-3 py-1">
                          {member.linkedin ? (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <Linkedin className="w-4 h-4" />
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-3 py-1 truncate">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(member.createdAt).toLocaleDateString("en-US", {
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
                              onClick={() => handleView(member)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(member)}
                              className="border-primary/20 text-primary hover:bg-primary/5"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(member.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                   		)}
												</Draggable>
											))}
											{provided.placeholder}
                
           				</tbody>
									</table>
								</div>
							)}
						</Droppable>
					</DragDropContext>
        )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center justify-between"
        >
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredMembers.length)} of{" "}
            {filteredMembers.length} results
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

      {/* View Member Modal */}
      <AnimatePresence>
        {showViewModal && viewingMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-6 relative">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <div className="inline-block p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-3">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Team Member</h2>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Profile Image */}
                <div className="text-center mb-6">
                  {viewingMember.image ? (
                    <img
                      src={viewingMember.image}
                      alt={viewingMember.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary/20 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto border-4 border-gray-200 shadow-lg">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Member Info Cards */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Full Name</p>
                        <p className="text-lg font-bold text-gray-900">{viewingMember.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Position</p>
                        <p className="text-sm font-semibold text-gray-900">{viewingMember.position}</p>
                      </div>
                    </div>
                  </div>

                  {viewingMember.linkedin && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Linkedin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">LinkedIn Profile</p>
                          <a
                            href={viewingMember.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            View Profile
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Joined Team</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(viewingMember.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 border-gray-300 hover:bg-gray-100"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false)
                      handleEdit(viewingMember)
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Member
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g. Senior Developer"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
               
             
                 
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

              

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <Input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    accept="image/*"
                    className="border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                  {imageFile && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
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
						{editingMember ? "Updating..." : "Submitting..."}
					  </div>
					) : (
					  editingMember ? "Save" : "Save"
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
