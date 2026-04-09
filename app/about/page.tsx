"use client"
import {
  Eye,
  Heart,
  Linkedin,
  Target,
  ChevronDown,
  ArrowRight,
  CheckCircle,
  Users,
  User,
  Globe,
  Building2,
  HardHat,
  ShieldCheck,
  CircleDollarSign,
  Clock,
  Lock,
  Handshake,
  Star,
  Lightbulb,
  Leaf,
} from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

import ScrollProgress from "@/components/ui/ScrollProgress"
import Link from "next/link"
import VideoBackground from "@/components/video-background"
interface TeamMember {
  id: string
  name: string
  position: string
  image?: string
  linkedin?: string
}

const features = [
  {
    icon: <Building2 className="w-12 h-12 text-primary mx-auto" />,
    title: "One-Stop Solution",
    desc: "From construction to cleaning and landscaping - we handle it all under one roof with integrated project management.",
    highlight: "500+ Projects Completed",
    benefits: ["Integrated Services", "Single Point of Contact", "Streamlined Communication", "Cost Efficiency"],
  },
  {
    icon: <HardHat className="w-12 h-12 text-primary mx-auto" />,
    title: "Experienced Team",
    desc: "Our certified professionals bring decades of combined experience with continuous training and development.",
    highlight: "50+ Expert Staff",
    benefits: ["Certified Professionals", "Ongoing Training", "Industry Expertise", "Quality Assurance"],
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-primary mx-auto" />,
    title: "Quality Guarantee",
    desc: "Comprehensive warranty programs with 24-month service guarantees and rigorous quality control processes.",
    highlight: "99.8% Client Satisfaction",
    benefits: ["24-Month Warranty", "Quality Control", "Regular Inspections", "Customer Support"],
  },
  {
    icon: <CircleDollarSign className="w-12 h-12 text-primary mx-auto" />,
    title: "Transparent Pricing",
    desc: "No hidden fees - detailed quotes with competitive, fair pricing and flexible payment options.",
    highlight: "20% Cost Savings Average",
    benefits: ["No Hidden Fees", "Detailed Quotes", "Competitive Rates", "Flexible Payment"],
  },
  {
    icon: <Clock className="w-12 h-12 text-primary mx-auto" />,
    title: "24/7 Support",
    desc: "Round-the-clock emergency response and customer support with dedicated account managers.",
    highlight: "2-Hour Response Time",
    benefits: ["Emergency Response", "Dedicated Support", "24/7 Availability", "Quick Resolution"],
  },
  {
    icon: <Lock className="w-12 h-12 text-primary mx-auto" />,
    title: "Licensed & Insured",
    desc: "Fully certified with comprehensive insurance coverage for your protection and peace of mind.",
    highlight: "$2M Insurance Coverage",
    benefits: ["Full Licensing", "Comprehensive Insurance", "Legal Compliance", "Risk Protection"],
  },
]

// Interactive Feature Card
const InteractiveFeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          className="text-5xl mb-6"
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 10 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {feature.icon}
        </motion.div>

        <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>

        <p className="text-gray-600 mb-6 leading-relaxed">{feature.desc}</p>

        <motion.div
          className="inline-block bg-gradient-to-r from-primary to-primary/80 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-lg mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {feature.highlight}
        </motion.div>

        <motion.div
          className="flex items-center justify-center text-primary font-medium"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 mr-2" />
          {isExpanded ? "Show Less" : "Learn More"}
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <h4 className="font-semibold text-gray-800 mb-3">Key Benefits:</h4>
              <div className="grid grid-cols-2 gap-2">
                {feature.benefits.map((benefit: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Team Member Card
const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => (
  <motion.div
    key={member.id}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -12 }}
    className="relative group cursor-pointer"
  >
    <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 h-full">
      {/* Blue header background */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-blue-500 to-indigo-600" />

      {/* LinkedIn Badge */}
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-6 right-6 z-20 flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-6"
          onClick={(e) => e.stopPropagation()}
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}

      {/* Avatar */}
      <div className="relative pt-4 pb-4 px-6">
        <div className="flex flex-col items-center">
          <div className="relative group/avatar">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-110" />
            <div className="relative w-36 h-44 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 p-1 shadow-xl group-hover/avatar:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-2xl border-4 border-white overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-blue-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative px-6 pb-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-sm font-semibold text-blue-600" dangerouslySetInnerHTML={{ __html: member.position }} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>

    {/* Floating shadow */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105" />
  </motion.div>
)

export default function EnhancedAboutPage() {
  const [activeTab, setActiveTab] = useState("mission")
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoadingTeam, setIsLoadingTeam] = useState(true)


  // Fetch team members from API
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoadingTeam(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"}/team`, {
          cache: "no-store",
        })
        if (!res.ok) throw new Error("Failed to fetch team")
        const teamData = await res.json()

    

        setTeam(teamData)
      } catch (err) {
        console.error("Error fetching team:", err)
        setTeam([])
      } finally {
        setIsLoadingTeam(false)
      }
    }

    fetchTeam()
  }, [])

  const coreValues = [
    {
      title: "Integrity",
      icon: <Handshake className="w-12 h-12 text-primary mx-auto" />,
      description: "Honest and transparent in all our dealings with unwavering ethical standards",
    },
    {
      title: "Quality",
      icon: <Star className="w-12 h-12 text-primary mx-auto" />,
      description: "Excellence in every project we undertake with rigorous quality control",
    },
    { title: "Reliability", icon: <Target className="w-12 h-12 text-primary mx-auto" />, description: "Consistent delivery on time and budget with dependable service" },
    { title: "Innovation", icon: <Lightbulb className="w-12 h-12 text-primary mx-auto" />, description: "Embracing new technologies and methods for better solutions" },
    { title: "Sustainability", icon: <Leaf className="w-12 h-12 text-primary mx-auto" />, description: "Environmental responsibility in all projects and operations" },
    { title: "Community", icon: <Heart className="w-12 h-12 text-primary mx-auto" />, description: "Contributing to local development and growth initiatives" },
  ]

  const tabs = [
    { id: "mission", label: "Mission", icon: Target },
    { id: "vision", label: "Vision", icon: Eye },
    { id: "purpose", label: "Purpose", icon: Heart },
  ]

  const tabContent = {
    mission: {
      title: "Our Mission",
      content:
        "To provide reliable, high-quality solutions that improve lives and communities across Rwanda and East Africa, while maintaining the highest standards of integrity and environmental responsibility. We strive to be the trusted partner for all construction, cleaning, and maintenance needs.",
      highlights: ["Quality Solutions", "Community Impact", "Environmental Responsibility", "Trusted Partnership"],
    },
    vision: {
      title: "Our Vision",
      content:
        "To be the leading provider of integrated services in East Africa, recognized for innovation, sustainability, and unwavering commitment to client success and community development. We envision a future where our services contribute to sustainable regional growth.",
      highlights: ["Regional Leadership", "Innovation Focus", "Sustainable Growth", "Client Success"],
    },
    purpose: {
      title: "Our Purpose",
      content:
        "Creating lasting positive impact through exceptional service delivery, fostering growth and development in every community we serve across the region. Our purpose drives us to exceed expectations and build lasting relationships.",
      highlights: ["Positive Impact", "Exceptional Service", "Community Growth", "Lasting Relationships"],
    },
  }

  return (
    <>
      <ScrollProgress />
      <VideoBackground />

      <div className="bg-gradient-to-br from-primary/90 via-primary/60 to-white/95 text-gray-800 overflow-hidden ">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden  py-12">
      

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-6xl mx-auto text-left space-y-8"
            >
           	
						{/* Badge */}
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="inline-flex items-center gap-2 bg-primary text-white border border-white px-4 py-2 rounded-full text-sm font-semibold"
						>
							<span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
							About Omega Sir Ltd
						</motion.div>

              {/* Extended Description */}
              <motion.p
                className="text-xl md:text-2xl  text-white/90 mb-6 drop-shadow-lg leading-relaxed text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                At OMEGA SIR Ltd, we are more than a company, we are a movement towards a better, more connected future.
                Our mission is to merge innovation, quality, and social responsibility to deliver solutions that matter.
              </motion.p>

              <motion.p
                className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md max-w-6xl mx-auto text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                From pioneering sustainable infrastructure projects to empowering local businesses, we work tirelessly
                to create lasting impact across East Africa. Every project we undertake is a step toward empowering the
                next generation.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center"
              >
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 w-fit rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <a href="#team" className="flex items-center">View Our Team <ArrowRight className="ml-2 w-5 h-5" /></a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 w-fit rounded-full backdrop-blur-sm bg-transparent inline-flex items-center justify-center"
                >
                  <Link href="/projects">View Our Projects</Link>
                </Button>
              </motion.div>
            </motion.div>

      
          </div>
        </section>

        {/* Interactive Foundation Section */}
        <section className="py-10 bg-white relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Foundation</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built on strong principles that guide every decision and action we take
              </p>
            </motion.div>

            {/* Interactive Tabs */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-wrap justify-center mb-8">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 mx-2 mb-2 rounded-full font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 text-center"
                >
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    {tabContent[activeTab as keyof typeof tabContent].title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {tabContent[activeTab as keyof typeof tabContent].content}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tabContent[activeTab as keyof typeof tabContent].highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-md"
                      >
                        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-700">{highlight}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Core Values Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Core Values</h3>
              <p className="text-lg text-gray-600">The principles that drive our excellence</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center"
                >
                  <motion.div className="text-4xl mb-4" whileHover={{ rotateY: 360 }} transition={{ duration: 0.6 }}>
                    {value.icon}
                  </motion.div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Leadership Team with Carousel */}
        <section id="team" className="py-8 bg-gradient-to-br from-gray-50 to-primary/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-4"
            >
              <div className="flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-4xl font-bold text-gray-800">Meet Our Leadership</h2>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Experienced leaders driving innovation and excellence across all our operations with decades of combined
                expertise
              </p>

      
            </motion.div>

            {isLoadingTeam ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : team.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {team.map((member, index) => (
                    <TeamMemberCard key={member.id} member={member} index={index} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No team members found. Please check back later.</p>
              </div>
            )}
          </div>
        </section>

        {/* Interactive Features Section */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Sets Us Apart</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why over 500 clients trust OMEGA SIR Ltd for their construction, cleaning, and maintenance
                needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <InteractiveFeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Project CTA Section */}
        <section className="relative bg-primary w-full min-h-[220px] flex items-center justify-center text-white overflow-hidden">
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 py-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Work With Us?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join hundreds of satisfied clients who trust OMEGA SIR Ltd for their construction, cleaning, and
              maintenance needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/contact" className="w-fit">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/projects" className="w-fit">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-8 py-4 rounded-full bg-transparent"
                >
                  View Our Projects
                </Button>
              </Link>
            </div>
          </div>
          {/* Bottom wave */}
          <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
            <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14">
              <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#1760b0" />
            </svg>
          </div>
        </section>
      </div>
    </>
  )
}
