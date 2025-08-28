"use client"
import Link from "next/link"
import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
  User,
} from "lucide-react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { fetchCurrentUser } from "@/lib/api" 
import { AnimatePresence } from "framer-motion"
import ProfileModal from "./ProfileModal"
const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Projects", href: "/admin/projects", icon: Package },
  { name: "Projects Categories", href: "/admin/categories", icon: Tag },
  { name: "Testimonials", href: "/admin/testimonials", icon: Package },
  { name: "Team", href: "/admin/team", icon: Users },
  { name: "Jobs", href: "/admin/jobs", icon: GraduationCap },
  { name: "Job Applications", href: "/admin/job-applications", icon: FolderOpen },
  { name: "Contact Messages", href: "/admin/contact-messages", icon: Mail },
  { name: "Partners", href: "/admin/partners", icon: Handshake },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  showAddButton?: boolean
  onAddClick?: () => void
  addButtonText?: string
}

function AdminLayoutContent({
  children,
  title,
  showAddButton = false,
  onAddClick,
  addButtonText = "Add New",
}: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<{ name: string} | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const router = useRouter()

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
            // If stored user is invalid, fetch from API
            fetchCurrentUser()
              .then((user) => setCurrentUser(user))
              .catch(() => {
                // If fetch fails, redirect to login
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                router.push("/admin/login")
              })
          }
        } else {
          // Fetch user data if not in localStorage
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

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl border-r border-gray-100 flex flex-col transform transition-all duration-500 ease-in-out overflow-hidden
					${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
					lg:translate-x-0
					overflow-y-auto h-screen
				`}
      >
{/* Header Section */}
<div className="relative bg-white border-b border-gray-200/80 shadow-sm">
  <div className="p-4">
    {/* Top Row - Logo and Close Button */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
          <div className="text-primary font-bold text-6xl">Ω</div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Omega Sir</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Admin Portal</p>
        </div>
      </div>
      
      {/* Close Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    {/* User Profile Section */}
    <div className="relative group">
      {/* User Info Card */}
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50 hover:border-gray-300/60 hover:shadow-md transition-all duration-300 cursor-pointer">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        {/* User Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {currentUser?.name || "Admin User"}
          </p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 group-hover:rotate-180" />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-200/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50 backdrop-blur-sm">
        <div className="p-3 space-y-1">
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 group/item"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 group-hover/item:bg-blue-100 transition-colors">
              <Settings className="h-4 w-4 text-gray-600 group-hover/item:text-blue-600 transition-colors" />
            </div>
            <div className="text-left">
              <span className="font-medium">Settings</span>
              <p className="text-xs text-gray-500">Manage your account</p>
            </div>
          </button>
          
          <div className="h-px bg-gray-200 mx-2 my-2"></div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/item"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 group-hover/item:bg-red-100 transition-colors">
              <LogOut className="h-4 w-4 text-red-500 group-hover/item:text-red-600 transition-colors" />
            </div>
            <div className="text-left">
              <span className="font-medium">Sign out</span>
              <p className="text-xs text-red-400">End your session</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium relative overflow-hidden text-sm
									${isActive ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25" : "text-gray-600 hover:text-sky-700 hover:bg-sky-50"}
								`}
                onClick={() => setSidebarOpen(false)}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl animate-pulse opacity-20" />
                )}

                <item.icon
                  className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-gray-500 group-hover:text-sky-600"}`}
                />
                <span className="relative z-10">{item.name}</span>

                {/* Hover effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            )
          })}
        </nav>

      
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-sky-600 p-1 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Welcome back to your dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {showAddButton && onAddClick && (
                <Button
                  onClick={onAddClick}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <span className="text-base">+</span>
                  {addButtonText}
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </main>
            <AnimatePresence>
        {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      </AnimatePresence>
    </div>
  )
}

// Export the component with no SSR to prevent hydration issues
export default dynamic(() => Promise.resolve(AdminLayoutContent), {
  ssr: false,
})
