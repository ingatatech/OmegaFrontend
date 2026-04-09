"use client"
import Link from "next/link"
import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  LogOut,
  Menu,
  X,
  Mail,
  Tag,
  GraduationCap,
  FolderOpen,
  HelpCircle,
  Handshake,
  Settings,
  ChevronDown,
  ChevronRight,
  User,
  Newspaper,
  MessageSquare,
} from "lucide-react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { fetchCurrentUser } from "@/lib/api"
import { AnimatePresence } from "framer-motion"
import ProfileModal from "./ProfileModal"

interface ExpandedSectionsState {
  overall: boolean
  content: boolean
  jobs: boolean
}

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  showAddButton?: boolean
  onAddClick?: () => void
  addButtonText?: string
}

const sidebarSections = [
  {
    id: "overall",
    title: "Overall",
    icon: LayoutDashboard,
    children: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    id: "content",
    title: "Content",
    icon: Newspaper,
    children: [
      { title: "Blogs", href: "/admin/blogs", icon: FileText },
      { title: "Projects", href: "/admin/projects", icon: Package },
      { title: "Categories", href: "/admin/categories", icon: Tag },
      { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { title: "Team", href: "/admin/team", icon: Users },
      { title: "Partners", href: "/admin/partners", icon: Handshake },
      { title: "Contact Messages", href: "/admin/contact-messages", icon: Mail },
      { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    id: "jobs",
    title: "Jobs",
    icon: GraduationCap,
    children: [
      { title: "Jobs", href: "/admin/jobs", icon: GraduationCap },
      { title: "Job Applications", href: "/admin/job-applications", icon: FolderOpen },
    ],
  },
]

function AdminLayoutContent({
  children,
  title,
  showAddButton = false,
  onAddClick,
  addButtonText = "Add New",
}: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsState>({
    overall: true,
    content: true,
    jobs: false,
  })
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Auto-expand section that contains the active route
  useEffect(() => {
    sidebarSections.forEach((section) => {
      const isActive = section.children.some((child) => child.href === pathname)
      if (isActive) {
        setExpandedSections((prev) => ({ ...prev, [section.id]: true }))
      }
    })
  }, [pathname])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/admin/login")
      } else {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser))
          } catch {
            fetchCurrentUser()
              .then((user) => setCurrentUser(user))
              .catch(() => {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                router.push("/admin/login")
              })
          }
        } else {
          fetchCurrentUser()
            .then((user) => setCurrentUser(user))
            .catch(() => {
              localStorage.removeItem("token")
              router.push("/admin/login")
            })
        }
      }
    }
  }, [router])

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/admin/login")
    }
  }

  function toggleSection(section: keyof ExpandedSectionsState) {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl border-r border-slate-200 flex flex-col transform transition-all duration-500 ease-in-out overflow-y-auto h-screen
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">Ω</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">Omega Sir Ltd</h1>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Admin Portal</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarSections.map((section) => {
            const isExpanded = expandedSections[section.id as keyof ExpandedSectionsState]
            const hasActiveChild = section.children.some((child) => child.href === pathname)
            return (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id as keyof ExpandedSectionsState)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
                    ${isExpanded || hasActiveChild
                      ? "bg-gradient-to-r from-blue-500/10 to-blue-600/5 text-blue-700 border-l-2 border-blue-500"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                      ${isExpanded || hasActiveChild ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                    >
                      <section.icon className="h-4 w-4" />
                    </div>
                    <span>{section.title}</span>
                  </div>
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />
                  }
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200">
                    {section.children.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group relative flex items-center gap-3 px-3 py-2.5 ml-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${isActive
                              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20"
                              : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                        >
                          {!isActive && (
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                          <span>{item.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-100 shadow-sm relative z-40">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-600 hover:text-blue-600 p-2 rounded-lg hover:bg-slate-100 transition-all"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {showAddButton && onAddClick && (
                  <button
                    onClick={onAddClick}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    + {addButtonText}
                  </button>
                )}
              </div>
            </div>

            {/* User dropdown */}
            <div className="relative group z-50">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md ring-2 ring-white">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {currentUser?.name || "Admin User"}
                  </span>
                  <span className="text-xs text-gray-500">Administrator</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:rotate-180 transition-all duration-300" />
              </div>

              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-95 group-hover:scale-100 transition-all duration-300 origin-top-right z-[9999]">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{currentUser?.name || "Admin"}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all group/item"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 group-hover/item:bg-blue-100 transition-colors">
                      <Settings className="h-4 w-4 text-gray-600 group-hover/item:text-blue-600 transition-colors" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium block">Account Settings</span>
                      <p className="text-xs text-gray-500">Manage your profile</p>
                    </div>
                  </button>
                  <div className="h-px bg-gray-100 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all group/item"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 group-hover/item:bg-red-100 transition-colors">
                      <LogOut className="h-4 w-4 text-red-500 group-hover/item:text-red-600 transition-colors" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium block">Sign Out</span>
                      <p className="text-xs text-red-400">End your session</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50">
          <div className="p-4 lg:p-8">{children}</div>
        </div>
      </main>

      <AnimatePresence>
        {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default dynamic(() => Promise.resolve(AdminLayoutContent), { ssr: false })
