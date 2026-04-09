"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminLayout from "./layout"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Package,
  Users,
  Briefcase,
  ArrowRight,
  Activity,
  Calendar,
  MessageSquare,
  Building,
  BarChart3,
  Settings,
  RefreshCw,
  HelpCircle,
  Handshake,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, BarChart, Bar } from "recharts"
import api from "@/lib/axios"
import ProfileModal from "./ProfileModal"
import Loader from "../Loader"

interface DashboardStats {
  blogs: number
  projects: number
  jobs: number
  team: number
  testimonials: number
  jobApplications: number
  faqs: number
  partners: number
}

interface MonthlyStats {
  month: number
  monthName: string
  blogs: number
  projects: number
  team: number
  jobs: number
  testimonials: number
  faqs: number
  partners: number
  jobApplications: number
  total: number
}

interface YearlyStats {
  year: number
  blogs: number
  projects: number
  team: number
  jobs: number
  testimonials: number
  faqs: number
  partners: number
  jobApplications: number
  total: number
}

interface StatisticsResponse {
  totals: DashboardStats
  monthly: MonthlyStats[]
  yearly: YearlyStats[]
  currentYear: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    blogs: 0,
    projects: 0,
    jobs: 0,
    team: 0,
    testimonials: 0,
    jobApplications: 0,
    faqs: 0,
    partners: 0,
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([])
  const [yearlyData, setYearlyData] = useState<YearlyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [timeRange, setTimeRange] = useState("monthly")
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      // Fetch statistics data
      const [statisticsRes] = await Promise.all([api.get("/users/statistics")])

      const statisticsData: StatisticsResponse = statisticsRes.data

      setStats(
        statisticsData?.totals || {
          blogs: 0,
          projects: 0,
          jobs: 0,
          team: 0,
          testimonials: 0,
          jobApplications: 0,
          faqs: 0,
          partners: 0,
        },
      )
      setMonthlyData(statisticsData?.monthly || [])
      setYearlyData(statisticsData?.yearly || [])
      setCurrentYear(statisticsData?.currentYear || new Date().getFullYear())
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err)
      setStats({
        blogs: 0,
        projects: 0,
        jobs: 0,
        team: 0,
        testimonials: 0,
        jobApplications: 0,
        faqs: 0,
        partners: 0,
      })
      setMonthlyData([])
      setYearlyData([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate growth percentages
  function calculateGrowth(
    current: number,
    previous: number,
  ): { percentage: string; trend: "up" | "down" | "neutral" } {
    if (previous === 0) {
      return { percentage: current > 0 ? "+100%" : "0%", trend: current > 0 ? "up" : "neutral" }
    }

    const growth = ((current - previous) / previous) * 100
    const percentage = growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`
    const trend = growth > 0 ? "up" : growth < 0 ? "down" : "neutral"

    return { percentage, trend }
  }

  // Get growth data for stat cards
  function getStatGrowth(key: keyof DashboardStats) {
    if (!monthlyData || monthlyData.length < 2) {
      return { percentage: "0%", trend: "neutral" as const }
    }

    const currentMonth = monthlyData[monthlyData.length - 1]
    const previousMonth = monthlyData[monthlyData.length - 2]

    if (!currentMonth || !previousMonth) {
      return { percentage: "0%", trend: "neutral" as const }
    }

    return calculateGrowth(currentMonth[key] || 0, previousMonth[key] || 0)
  }

  // Prepare chart data based on time range
  const chartData = timeRange === "monthly" ? monthlyData : yearlyData
  const chartDataKey = timeRange === "monthly" ? "monthName" : "year"

  const statCards = [
    {
      title: "Total Projects",
      value: stats?.projects || 0,
      growth: getStatGrowth("projects"),
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      href: "/admin/projects",
      description: "Active projects",
    },
    {
      title: "Job Applications",
      value: stats?.jobApplications || 0,
      growth: getStatGrowth("jobApplications"),
      icon: Briefcase,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      href: "/admin/job-applications",
      description: "Total applications",
    },
    {
      title: "Blog Posts",
      value: stats?.blogs || 0,
      growth: getStatGrowth("blogs"),
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      href: "/admin/blogs",
      description: "Published articles",
    },
    {
      title: "Testimonials",
      value: stats?.testimonials || 0,
      // growth: getStatGrowth("testimonials"),
      icon: MessageSquare,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      href: "/admin/testimonials",
      description: "Client feedback",
    },
    {
      title: "Team Members",
      value: stats?.team || 0,
      growth: getStatGrowth("team"),
      icon: Users,
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
      href: "/admin/team",
      description: "Active members",
    },
    {
      title: "Job Postings",
      value: stats?.jobs || 0,
      growth: getStatGrowth("jobs"),
      icon: Building,
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100",
      href: "/admin/jobs",
      description: "Open positions",
    },
    {
      title: "FAQs",
      value: stats?.faqs || 0,
      growth: getStatGrowth("faqs"),
      icon: HelpCircle,
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
      href: "/admin/faqs",
      description: "Help articles",
    },
    {
      title: "Partners",
      value: stats?.partners || 0,
      growth: getStatGrowth("partners"),
      icon: Handshake,
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-100",
      href: "/admin/partners",
      description: "Business partners",
    },
  ]

  return (
    <AdminLayout title="Dashboard">
      {/* Header Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="monthly">Monthly View ({currentYear})</option>
              {/* <option value="yearly">Yearly View (5 Years)</option> */}
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="border-gray-200 bg-transparent text-xs px-2 py-1"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex items-center">
          <Button
            onClick={() => setShowProfileModal(true)}
            className="text-white bg-primary hover:bg-primary/90 text-xs px-3 py-1"
          >
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </Button>
        </div>
      </motion.div>

      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Welcome back, Admin! 👋</h2>
              <p className="text-blue-100 text-sm mb-2">Here's your OMEGA SIR platform overview for {currentYear}.</p>
              <div className="flex items-center gap-4 text-xs text-blue-200">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Total Records:{" "}
                  {stats
                    ? Object.values(stats)
                        .reduce((sum, val) => sum + (val || 0), 0)
                        .toLocaleString()
                    : "0"}
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={stat.href}>
              <div
                className={`group bg-gradient-to-br ${stat.bgGradient} border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-700 text-xs font-semibold mb-1">{stat.title}</h3>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {loading ? "..." : stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">{stat.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 mb-4">
        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Detailed Analytics</h3>
              <p className="text-xs text-gray-600">
                Complete breakdown by {timeRange === "monthly" ? "month" : "year"}
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey={chartDataKey}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  tickFormatter={(value) => (timeRange === "monthly" ? value.slice(0, 3) : value.toString())}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip labelFormatter={(value) => (timeRange === "monthly" ? value : `Year ${value}`)} />
                <Legend />
                <Bar dataKey="projects" fill="#3b82f6" name="Projects" radius={[2, 2, 0, 0]} />
                <Bar dataKey="jobApplications" fill="#10b981" name="Applications" radius={[2, 2, 0, 0]} />
                <Bar dataKey="blogs" fill="#8b5cf6" name="Blogs" radius={[2, 2, 0, 0]} />
                <Bar dataKey="testimonials" fill="#f59e0b" name="Testimonials" radius={[2, 2, 0, 0]} />
                <Bar dataKey="team" fill="#ef4444" name="Team" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            	<div className="min-h-screen py-10 bg-white flex items-center justify-center">
      <Loader size="lg" />
    </div>
          )}
        </motion.div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      </AnimatePresence>
    </AdminLayout>
  )
}
