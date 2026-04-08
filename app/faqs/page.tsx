"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Phone,
  Clock,
  Shield,
  DollarSign,
  Wrench,
  Building,
  Users,
  Filter,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ScrollProgress from "@/components/ui/ScrollProgress"
import { fetchFAQs } from "@/lib/api"
import { FAQ, FAQCategory } from "@/lib/types"
import VideoBackground from "@/components/video-background"

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  Services: Building,
  Pricing: DollarSign,
  Payment: DollarSign,
  Scheduling: Clock,
  Warranty: Shield,
  Booking: Phone,
  Consultation: MessageCircle,
  Company: Users,
  "Licensing & Insurance": Shield,
  Preparation: Wrench,
}

// FAQ Item Component
const FAQItem = ({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQ
  index: number
  isOpen: boolean
  onToggle: () => void
}) => {
  const IconComponent = categoryIcons[faq.category] || HelpCircle

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <motion.button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <IconComponent className="w-5 h-5" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{faq.question}</h3>
            <Badge variant="secondary" className="text-xs">
              {faq.category}
            </Badge>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="pl-16">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {faq.tags.map((tag: string, tagIndex: number) => (
                    <motion.span
                      key={tagIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: tagIndex * 0.1 }}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
            
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function EnhancedFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openItems, setOpenItems] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

  // Load FAQs from API
  useEffect(() => {
    loadFAQs()
        const timer = setTimeout(() => {
      scrollToFaqs()
    }, 1500) // Delay of 1.5 seconds to allow hero section to be viewed briefly
    
    return () => clearTimeout(timer)
  }, [])

      const loadFAQs = async () => {
      try {
        setLoading(true)
        const data = await fetchFAQs()
        setFaqs(data)
      } catch (err) {
        setError("Failed to load FAQs. Please try again later.")
        console.error("Error fetching FAQs:", err)
      } finally {
        setLoading(false)
      }
    }
  const scrollToFaqs = () => {
    const faqsSection = document.getElementById('faqs')
    if (faqsSection) {
      faqsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
  // Generate categories from FAQ data
  const categories: FAQCategory[] = [
    { name: "All", icon: HelpCircle, count: faqs.length },
    ...Array.from(new Set(faqs.map((faq) => faq.category))).map((category) => ({
      name: category,
      icon: categoryIcons[category] || HelpCircle,
      count: faqs.filter((faq) => faq.category === category).length,
    })),
  ]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const expandAll = () => {
    setOpenItems(filteredFAQs.map((faq) => faq.id))
  }

  const collapseAll = () => {
    setOpenItems([])
  }

  // Handle responsive behavior safely
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768)
      }
    }

    checkMobile()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [])

  

  return (
    <>
      <ScrollProgress />
  <VideoBackground/>
      <div className="bg-gradient-to-br from-primary/90 via-primary/60 to-white/95 min-h-screen text-gray-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />

        <div className="min-h-screen  relative z-10">
          {/* Enhanced Hero Section */}
          <section className="py-10 relative">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-6xl mx-auto"
              >
             

                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Frequently Asked{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Questions
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Find instant answers to common questions about our services, pricing, and processes. Can't find what
                  you're looking for? We're here to help.
                </motion.p>

          

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-start"
                >
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Browse FAQs
                   
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-full backdrop-blur-sm bg-transparent"
                  >
                   <a href="/contact"> Contact Support</a>
                  
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>

{loading? (

     <div className="min-h-screen bg-gradient-to-br from-primary/90 via-primary/60 to-white/95 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-lg text-white">Loading FAQs...</p>
          </div>
        </div>
):faqs.length >0 ?(

<div>


          {/* FAQ Section */}
          <section id="faqs" className="py-5 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Find Your Answers</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Search through our comprehensive FAQ database or browse by category to find the information you need
                </p>
              </motion.div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto mb-12"
              >
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search questions, answers, or topics..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Categories ({selectedCategory})
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
                  </Button>
                </div>

                {/* Category Filters */}
                <AnimatePresence>
                  {(showMobileFilters || !isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 mb-6"
                    >
                      {categories.map((category, index) => (
                        <motion.button
                          key={category.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setSelectedCategory(category.name)
                            setShowMobileFilters(false)
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                            selectedCategory === category.name
                              ? "bg-primary text-white shadow-lg"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <category.icon className="w-4 h-4" />
                          {category.name}
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand/Collapse Controls */}
                {filteredFAQs.length > 0 && (
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-gray-600">
                      Showing {filteredFAQs.length} of {faqs.length} questions
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={expandAll} className="text-xs bg-transparent">
                        Expand All
                      </Button>
                      <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs bg-transparent">
                        Collapse All
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* FAQ Items */}
              <div className="max-w-4xl mx-auto">
                {filteredFAQs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        index={index}
                        isOpen={openItems.includes(faq.id)}
                        onToggle={() => toggleItem(faq.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-3xl shadow-lg"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No questions found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or browse different categories.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("All")
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </section>

          {/* Popular Topics */}
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Popular Topics</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Quick access to the most frequently asked questions
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {categories
                  .filter((cat) => cat.name !== "All" && cat.count > 0)
                  .slice(0, 6)
                  .map((category, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => {
                        setSelectedCategory(category.name)
                        document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 border border-primary/10"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <category.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.count} questions</p>
                        </div>
                      </div>
                      <div className="flex items-center text-primary text-sm font-medium">
                        View Questions
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </motion.button>
                  ))}
              </div>
            </div>
          </section>

          {/* Bottom wave */}
          <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
            <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14">
              <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#1760b0" />
            </svg>
          </div>
        </div>
):error ?(
  <div className="min-h-screen bg-gradient-to-br from-primary/90 via-primary/60 to-white/95 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <div className="text-red-400 text-xl mb-4">{error}</div>
            <Button onClick={() => window.location.reload()} className="bg-white text-primary hover:bg-white/90">
              Try Again
            </Button>
          </div>
        </div>

):(
   <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No team members found. Please check back later.</p>
              </div>

        )}
      </div>
      </div>
    </>
  )
}


  