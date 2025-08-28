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

        <div className="relative z-10">
          {/* Enhanced Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-4xl mx-auto"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-sm mb-8"
                >
                  <HelpCircle className="w-16 h-16 text-white" />
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
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
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Browse FAQs
                    <ChevronDown className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-full backdrop-blur-sm bg-transparent"
                  >
                   <a href="/contact"> Contact Support</a>
                    <MessageCircle className="ml-2 w-5 h-5" />
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
          <section className="py-5 bg-white">
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





// "use client"
// import { useEffect, useState } from "react"
// import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
// import {
//   Search,
//   ChevronDown,
//   ChevronRight,
//   HelpCircle,
//   MessageCircle,
//   Phone,
//   Clock,
//   Shield,
//   DollarSign,
//   Wrench,
//   Building,
//   Users,
//   Filter,
//   X,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import ScrollProgress from "@/components/ui/ScrollProgress"


// const faqData = [
//   {
//     id: 1,
//     category: "Services",
//     icon: Building,
//     question: "What services does OMEGA SIR Ltd provide?",
//     answer:
//       "We offer comprehensive services including Construction (building, utilities, demolition, installation, finishing), and Cleaning & Landscaping (commercial cleaning, residential cleaning, landscape maintenance). Our integrated approach means you get all services under one roof with consistent quality and communication.",
//     tags: ["construction", "cleaning", "landscaping", "services"],
//   },
//   {
//     id: 2,
//     category: "Services",
//     icon: Building,
//     question: "What geographic areas do you serve?",
//     answer:
//       "We primarily serve Kigali and surrounding areas in Rwanda, with capabilities to extend services throughout East Africa for larger projects. Our local presence ensures quick response times and familiarity with regional regulations and requirements.",
//     tags: ["location", "service area", "kigali", "rwanda"],
//   },
//   {
//     id: 3,
//     category: "Licensing & Insurance",
//     icon: Shield,
//     question: "Are you licensed and insured?",
//     answer:
//       "Yes, OMEGA SIR Ltd is fully licensed for all services we provide and carries comprehensive insurance coverage including general liability, workers' compensation, and professional indemnity insurance. License numbers and certificates are available upon request for your peace of mind.",
//     tags: ["license", "insurance", "certified", "legal"],
//   },
//   {
//     id: 4,
//     category: "Company",
//     icon: Users,
//     question: "How long have you been in business?",
//     answer:
//       "OMEGA SIR Ltd has been serving the East African market for over 15 years, building a reputation for excellence, reliability, and innovation. Our experience spans hundreds of successful projects across various sectors.",
//     tags: ["experience", "history", "established", "reputation"],
//   },
//   {
//     id: 5,
//     category: "Services",
//     icon: Clock,
//     question: "Do you offer emergency services?",
//     answer:
//       "Yes, we provide 24/7 emergency services for urgent repairs, cleaning situations, and construction-related emergencies. Our emergency response team is available around the clock with typical response times of 2 hours or less. Emergency service rates may apply.",
//     tags: ["emergency", "24/7", "urgent", "response"],
//   },
//   {
//     id: 6,
//     category: "Pricing",
//     icon: DollarSign,
//     question: "How do you determine pricing for services?",
//     answer:
//       "Pricing varies by service type and project complexity. We provide free estimates for construction projects, competitive hourly rates for repairs and cleaning, and transparent retail pricing for projects. All estimates include detailed breakdowns of materials, labor, and any additional costs with no hidden fees.",
//     tags: ["pricing", "estimates", "cost", "transparent"],
//   },
//   {
//     id: 7,
//     category: "Pricing",
//     icon: DollarSign,
//     question: "Do you offer free estimates?",
//     answer:
//       "Yes, we provide free, no-obligation estimates for most services. On-site evaluations may be required for complex projects to ensure accuracy. Our detailed estimates help you make informed decisions about your project.",
//     tags: ["free estimate", "no obligation", "evaluation"],
//   },
//   {
//     id: 8,
//     category: "Payment",
//     icon: DollarSign,
//     question: "What payment methods do you accept?",
//     answer:
//       "We accept cash, check, all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and offer flexible payment plans for larger projects. Business accounts can establish credit terms for ongoing services.",
//     tags: ["payment", "credit cards", "payment plans", "flexible"],
//   },
//   {
//     id: 9,
//     category: "Payment",
//     icon: DollarSign,
//     question: "Do you require payment upfront?",
//     answer:
//       "Payment terms vary by project size and type. Small projects typically require payment upon completion. Larger construction projects may require a deposit (usually 10-25%) with progress payments. Retail purchases require full payment at time of purchase.",
//     tags: ["upfront payment", "deposit", "payment terms"],
//   },
//   {
//     id: 10,
//     category: "Scheduling",
//     icon: Clock,
//     question: "How quickly can you start a project?",
//     answer:
//       "Timeline depends on service type and current scheduling. Emergency repairs can often be addressed same-day. Standard repair services typically scheduled within 48-72 hours. Construction projects require planning time but we strive to begin within 1-2 weeks of contract signing. Cleaning services can usually be scheduled within a few days.",
//     tags: ["timeline", "scheduling", "start date", "availability"],
//   },
//   {
//     id: 11,
//     category: "Scheduling",
//     icon: Clock,
//     question: "How long do typical projects take?",
//     answer:
//       "Project duration varies significantly: Small repairs: 1-4 hours, Appliance repairs: 1-3 days, Residential cleaning: 2-6 hours, Commercial cleaning: Varies by size and frequency, Small construction: 1-4 weeks, Large construction: 2-6 months or more. We provide realistic timelines during the estimate process.",
//     tags: ["duration", "timeline", "project length"],
//   },
//   {
//     id: 12,
//     category: "Scheduling",
//     icon: Clock,
//     question: "What if my project takes longer than estimated?",
//     answer:
//       "We provide realistic timelines and communicate any potential delays immediately. Weather, permit delays, or unforeseen complications may extend timelines. We work diligently to minimize disruptions and keep projects on schedule while maintaining our quality standards.",
//     tags: ["delays", "timeline", "communication", "quality"],
//   },
//   {
//     id: 13,
//     category: "Warranty",
//     icon: Shield,
//     question: "Do you guarantee your work?",
//     answer:
//       "Yes, we stand behind all our work with comprehensive warranties: Construction work: 1-2-year warranty on labor and materials, Repairs: 90-day warranty on service and replacement parts, Cleaning services: 24-hour satisfaction guarantee, Retail projects: Manufacturer warranties plus our service support.",
//     tags: ["warranty", "guarantee", "quality assurance"],
//   },
//   {
//     id: 14,
//     category: "Warranty",
//     icon: Shield,
//     question: "What is covered under your warranty?",
//     answer:
//       "Our warranties cover defects in workmanship and materials. They do not cover damage from normal wear and tear, misuse, accidents, or acts of nature. Detailed warranty terms are provided with each completed project for your reference.",
//     tags: ["warranty coverage", "terms", "exclusions"],
//   },
//   {
//     id: 15,
//     category: "Warranty",
//     icon: Shield,
//     question: "How do I make a warranty claim?",
//     answer:
//       "Contact our customer service team with your project details and description of the issue. We will schedule an inspection and resolve warranty issues at no charge if covered under our guarantee terms. Our goal is quick resolution of any concerns.",
//     tags: ["warranty claim", "customer service", "inspection"],
//   },
//   {
//     id: 16,
//     category: "Booking",
//     icon: Phone,
//     question: "How do I schedule a service appointment?",
//     answer:
//       "You can schedule services through our website contact form, by phone, email, or through our online booking system. We'll confirm your appointment and provide preparation instructions to ensure everything goes smoothly.",
//     tags: ["scheduling", "appointment", "booking", "contact"],
//   },
//   {
//     id: 17,
//     category: "Consultation",
//     icon: MessageCircle,
//     question: "Do you offer consultations?",
//     answer:
//       "Yes, we provide free consultations for most services. Complex projects may require a detailed assessment with associated fees that can be applied toward the project cost. Our consultations help ensure the best solution for your needs.",
//     tags: ["consultation", "assessment", "free", "advice"],
//   },
//   {
//     id: 18,
//     category: "Consultation",
//     icon: MessageCircle,
//     question: "Can I get a second opinion on a repair?",
//     answer:
//       "Absolutely. We encourage customers to make informed decisions. We provide honest assessments and will explain when replacement might be more cost-effective than repair. Our goal is to provide the best value for your investment.",
//     tags: ["second opinion", "honest assessment", "repair vs replace"],
//   },
//   {
//     id: 19,
//     category: "Preparation",
//     icon: Wrench,
//     question: "What should I prepare before your arrival?",
//     answer:
//       "Preparation instructions vary by service type. We provide specific guidance when scheduling, such as clearing work areas, securing pets, or gathering relevant documentation or warranties. Proper preparation helps ensure efficient service delivery.",
//     tags: ["preparation", "instructions", "work area", "documentation"],
//   },
// ]

// const categories = [
//   { name: "All", icon: HelpCircle, count: faqData.length },
//   { name: "Services", icon: Building, count: faqData.filter((faq) => faq.category === "Services").length },
//   { name: "Pricing", icon: DollarSign, count: faqData.filter((faq) => faq.category === "Pricing").length },
//   { name: "Payment", icon: DollarSign, count: faqData.filter((faq) => faq.category === "Payment").length },
//   { name: "Scheduling", icon: Clock, count: faqData.filter((faq) => faq.category === "Scheduling").length },
//   { name: "Warranty", icon: Shield, count: faqData.filter((faq) => faq.category === "Warranty").length },
//   { name: "Booking", icon: Phone, count: faqData.filter((faq) => faq.category === "Booking").length },
//   { name: "Consultation", icon: MessageCircle, count: faqData.filter((faq) => faq.category === "Consultation").length },
//   { name: "Company", icon: Users, count: faqData.filter((faq) => faq.category === "Company").length },
//   {
//     name: "Licensing & Insurance",
//     icon: Shield,
//     count: faqData.filter((faq) => faq.category === "Licensing & Insurance").length,
//   },
//   { name: "Preparation", icon: Wrench, count: faqData.filter((faq) => faq.category === "Preparation").length },
// ]

// // FAQ Item Component
// const FAQItem = ({
//   faq,
//   index,
//   isOpen,
//   onToggle,
// }: { faq: any; index: number; isOpen: boolean; onToggle: () => void }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
//     >
//       <motion.button
//         onClick={onToggle}
//         className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
//         whileHover={{ x: 5 }}
//         transition={{ duration: 0.2 }}
//       >
//         <div className="flex items-center gap-4 flex-1">
//           <motion.div
//             className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white flex-shrink-0"
//             whileHover={{ scale: 1.1, rotate: 5 }}
//             transition={{ duration: 0.3 }}
//           >
//             <faq.icon className="w-5 h-5" />
//           </motion.div>
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-gray-800 mb-1">{faq.question}</h3>
//             <Badge variant="secondary" className="text-xs">
//               {faq.category}
//             </Badge>
//           </div>
//         </div>
//         <motion.div
//           animate={{ rotate: isOpen ? 180 : 0 }}
//           transition={{ duration: 0.3 }}
//           className="flex-shrink-0 ml-4"
//         >
//           <ChevronDown className="w-5 h-5 text-gray-400" />
//         </motion.div>
//       </motion.button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden"
//           >
//             <div className="px-6 pb-6">
//               <div className="pl-16">
//                 <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {faq.tags.map((tag: string, tagIndex: number) => (
//                     <motion.span
//                       key={tagIndex}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: tagIndex * 0.1 }}
//                       className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
//                     >
//                       {tag}
//                     </motion.span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }

// export default function EnhancedFAQPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState("All")
//   const [openItems, setOpenItems] = useState<number[]>([])
//   const [showMobileFilters, setShowMobileFilters] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)
//   const { scrollY } = useScroll()
//   const y1 = useTransform(scrollY, [0, 300], [0, 50])
//   const y2 = useTransform(scrollY, [0, 300], [0, -50])

//   const filteredFAQs = faqData.filter((faq) => {
//     const matchesSearch =
//       faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

//     const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory

//     return matchesSearch && matchesCategory
//   })

//   const toggleItem = (id: number) => {
//     setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
//   }

//   const expandAll = () => {
//     setOpenItems(filteredFAQs.map((faq) => faq.id))
//   }

//   const collapseAll = () => {
//     setOpenItems([])
//   }

//   // Handle responsive behavior safely
//   useEffect(() => {
//     const checkMobile = () => {
//       if (typeof window !== 'undefined') {
//         setIsMobile(window.innerWidth < 768)
//       }
//     }
    
//     checkMobile()
    
//     if (typeof window !== 'undefined') {
//       window.addEventListener('resize', checkMobile)
//       return () => window.removeEventListener('resize', checkMobile)
//     }
//   }, [])
//   return (
//     <>
//       <ScrollProgress />

//       <div className="bg-gradient-to-br from-primary/90 via-primary/60 to-white/95 min-h-screen text-gray-800 relative overflow-hidden">
//         {/* Animated Background Elements */}
//         <motion.div
//           style={{ y: y1 }}
//           className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
//         />
//         <motion.div
//           style={{ y: y2 }}
//           className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
//         />

//         <div className="relative z-10">
//           {/* Enhanced Hero Section */}
//           <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//             <div className="container mx-auto px-4 text-center">
//               <motion.div
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 1 }}
//                 className="max-w-4xl mx-auto"
//               >
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.8, delay: 0.2 }}
//                   className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-sm mb-8"
//                 >
//                   <HelpCircle className="w-16 h-16 text-white" />
//                 </motion.div>

//                 <motion.h1
//                   className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.8, delay: 0.4 }}
//                 >
//                   Frequently Asked{" "}
//                   <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
//                     Questions
//                   </span>
//                 </motion.h1>

//                 <motion.p
//                   className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg leading-relaxed"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6, duration: 0.8 }}
//                 >
//                   Find instant answers to common questions about our services, pricing, and processes. Can't find what
//                   you're looking for? We're here to help.
//                 </motion.p>

         

//                 {/* CTA Buttons */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 1, duration: 0.8 }}
//                   className="flex flex-col sm:flex-row gap-4 justify-center"
//                 >
//                   <Button
//                     size="lg"
//                     className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
//                     onClick={() => document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" })}
//                   >
//                     Browse FAQs
//                     <ChevronDown className="ml-2 w-5 h-5" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-full backdrop-blur-sm bg-transparent"
//                   >
//                     Contact Support
//                     <MessageCircle className="ml-2 w-5 h-5" />
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             </div>
//           </section>

//           {/* FAQ Section */}
//           <section id="faqs" className="py-5 bg-white">
//             <div className="container mx-auto px-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//                 className="text-center mb-16"
//               >
//                 <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Find Your Answers</h2>
//                 <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//                   Search through our comprehensive FAQ database or browse by category to find the information you need
//                 </p>
//               </motion.div>

//               {/* Search and Filters */}
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="max-w-4xl mx-auto mb-12"
//               >
//                 {/* Search Bar */}
//                 <div className="relative mb-6">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Search questions, answers, or topics..."
//                     className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   {searchTerm && (
//                     <button
//                       onClick={() => setSearchTerm("")}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>

//                 {/* Mobile Filter Toggle */}
//                 <div className="md:hidden mb-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowMobileFilters(!showMobileFilters)}
//                     className="w-full justify-between"
//                   >
//                     <span className="flex items-center gap-2">
//                       <Filter className="w-4 h-4" />
//                       Categories ({selectedCategory})
//                     </span>
//                     <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
//                   </Button>
//                 </div>

//                 {/* Category Filters */}
//                 <AnimatePresence>
//                   {(showMobileFilters || !isMobile) && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="flex flex-wrap gap-2 mb-6"
//                     >
//                       {categories.map((category, index) => (
//                         <motion.button
//                           key={category.name}
//                           initial={{ opacity: 0, scale: 0.8 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           transition={{ delay: index * 0.05 }}
//                           onClick={() => {
//                             setSelectedCategory(category.name)
//                             setShowMobileFilters(false)
//                           }}
//                           className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
//                             selectedCategory === category.name
//                               ? "bg-primary text-white shadow-lg"
//                               : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                           }`}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                         >
//                           <category.icon className="w-4 h-4" />
//                           {category.name}
//                           <Badge variant="secondary" className="text-xs">
//                             {category.count}
//                           </Badge>
//                         </motion.button>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Expand/Collapse Controls */}
//                 {filteredFAQs.length > 0 && (
//                   <div className="flex justify-between items-center mb-6">
//                     <div className="text-sm text-gray-600">
//                       Showing {filteredFAQs.length} of {faqData.length} questions
//                     </div>
//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm" onClick={expandAll} className="text-xs bg-transparent">
//                         Expand All
//                       </Button>
//                       <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs bg-transparent">
//                         Collapse All
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>

//               {/* FAQ Items */}
//               <div className="max-w-4xl mx-auto">
//                 {filteredFAQs.length > 0 ? (
//                   <div className="space-y-4">
//                     {filteredFAQs.map((faq, index) => (
//                       <FAQItem
//                         key={faq.id}
//                         faq={faq}
//                         index={index}
//                         isOpen={openItems.includes(faq.id)}
//                         onToggle={() => toggleItem(faq.id)}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-center py-16 bg-white rounded-3xl shadow-lg"
//                   >
//                     <div className="text-6xl mb-4">🔍</div>
//                     <h3 className="text-2xl font-bold text-gray-800 mb-2">No questions found</h3>
//                     <p className="text-gray-600 mb-6">
//                       Try adjusting your search terms or browse different categories.
//                     </p>
//                     <Button
//                       onClick={() => {
//                         setSearchTerm("")
//                         setSelectedCategory("All")
//                       }}
//                       className="bg-primary hover:bg-primary/90"
//                     >
//                       Clear Filters
//                     </Button>
//                   </motion.div>
//                 )}
//               </div>
//             </div>
//           </section>

       
//           {/* Popular Topics */}
//           <section className="py-5 bg-white">
//             <div className="container mx-auto px-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//                 className="text-center mb-16"
//               >
//                 <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Popular Topics</h2>
//                 <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//                   Quick access to the most frequently asked questions
//                 </p>
//               </motion.div>

//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//                 {[
//                   { title: "Service Areas", questions: 3, icon: Building },
//                   { title: "Pricing & Estimates", questions: 4, icon: DollarSign },
//                   { title: "Emergency Services", questions: 2, icon: Clock },
//                   { title: "Warranty & Guarantees", questions: 3, icon: Shield },
//                   { title: "Scheduling & Timeline", questions: 3, icon: Clock },
//                   { title: "Payment Options", questions: 2, icon: DollarSign },
//                 ].map((topic, index) => (
//                   <motion.button
//                     key={index}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     whileHover={{ scale: 1.05, y: -5 }}
//                     onClick={() => {
//                       const categoryMap: { [key: string]: string } = {
//                         "Service Areas": "Services",
//                         "Pricing & Estimates": "Pricing",
//                         "Emergency Services": "Services",
//                         "Warranty & Guarantees": "Warranty",
//                         "Scheduling & Timeline": "Scheduling",
//                         "Payment Options": "Payment",
//                       }
//                       setSelectedCategory(categoryMap[topic.title] || "All")
//                       document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" })
//                     }}
//                     className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 border border-primary/10"
//                   >
//                     <div className="flex items-center gap-4 mb-3">
//                       <div className="p-3 rounded-xl bg-primary/10">
//                         <topic.icon className="w-6 h-6 text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-800">{topic.title}</h3>
//                         <p className="text-sm text-gray-600">{topic.questions} questions</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center text-primary text-sm font-medium">
//                       View Questions
//                       <ChevronRight className="w-4 h-4 ml-1" />
//                     </div>
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </>
//   )
// }
