"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { Mail, Phone, MapPin, Clock, Send} from "lucide-react"
import ScrollProgress from "@/components/ui/ScrollProgress"
import { sendContactMessage } from "@/lib/api" 
import toast from "react-hot-toast" // Import toast
import VideoBackground from "@/components/video-background"

export default function InteractiveContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "General Inquiry",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    
    const timer = setTimeout(() => {
      scrollToContact()
    }, 1500) // Delay of 1.5 seconds to allow hero section to be viewed briefly
    
    return () => clearTimeout(timer)
  }, [])
  
    const scrollToContact = () => {
      const contactsformSection = document.getElementById('contact-form')
      if (contactsformSection) {
        contactsformSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission

    // Client-side validation
    if (!formData.name || !formData.email || !formData.serviceInterest || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.")
      return
    }
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await sendContactMessage(formData)
      if (res.status === 200 || res.status === 201) {
        toast.success("Message sent! We'll get back to you soon.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          serviceInterest: "General Inquiry",
          subject: "",
          message: "",
        })
      } else {
        toast.error("Failed to send message.")
      }
    } catch (err) {
      console.error("Contact form submission error:", err)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ScrollProgress />
      <VideoBackground />
       
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20 animate-bounce"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute top-1/3 left-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-40 animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Hero Section with Animated Particles + Waves */}
        <div className="relative inset-0 bg-gradient-to-br  from-primary/90 via-primary/60 to-primary text-white overflow-hidden">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container max-w-6xl mx-auto px-5 py-10 text-left">
            <h1 className="text-4xl font-bold font-title mb-6 text-left">Get in Touch With OMEGA SIR Ltd</h1>
            <p className="max-w-6xl mx-auto text-blue-100 font-body font-medium text-base md:text-xl mb-10 text-left">
              Have questions about our services? We're here to help you build, maintain, and grow through
              <span className="text-white font-semibold"> construction</span>,
              <span className="text-white font-semibold"> cleaning</span>,
              <span className="text-white font-semibold"> Building Maintenance</span>,
              <span className="text-white font-semibold"> Production Workshop</span>,
              
              <span className="text-white font-semibold"> Interior Design</span> expertise.
            </p>

            <div className="flex justify-center w-full">
              <button
                onClick={() => {
                  const el = document.getElementById("contact-form")
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>

        </div>

        {/* Main Content */}
      
     <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Get In Touch</h1>
          <p className="text-gray-600">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

   <div className="grid lg:grid-cols-2 gap-8 lg:items-start">
  {/* Contact Information Card */}
  <div className="space-y-4 h-full">
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        Contact Information
      </h2>

      <div className="space-y-4 flex-1">
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
          <div className="bg-blue-100 p-2 rounded-full">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm">Our Office</h3>
            <p className="text-gray-600 text-sm">Kimironko-Gasabo, Kigali-Rwanda, PO. Box 5020 Kigali, KG 11 Ave</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Phone, label: "Phone 1", number: "+250781185860" },
            { icon: Phone, label: "Phone 2", number: "+250781812466" },
            { icon: Phone, label: "Phone 3", number: "+250783075259" },
          ].map((contact, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <div className="bg-blue-100 p-1.5 rounded-full">
                <contact.icon className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800">{contact.label}</p>
                <a href={`tel:${contact.number}`} className="text-blue-600 hover:underline text-xs">
                  {contact.number}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
          <div className="bg-blue-100 p-2 rounded-full">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-1">
            <div>
              <h3 className="font-medium text-gray-800 text-sm">Email</h3>
              <a href="mailto:omegasirltd@gmail.com" className="text-blue-600 hover:underline text-sm">
                omegasirltd@gmail.com
              </a>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 text-sm">Customer Service</h3>
              <a href="mailto:omegasirltd@gmail.com" className="text-blue-600 hover:underline text-sm">
                omegasirltd@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
          <div className="bg-blue-100 p-2 rounded-full">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1 text-sm">Business Hours</h3>
            <div className="space-y-0.5 text-xs text-gray-600">
              <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
              <p>Sat: 9:00 AM - 4:00 PM</p>
              <p>Sun: Closed (Emergency services available)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Contact Form */}
  <form
    id="contact-form"
    onSubmit={handleSubmit}
    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
  >
    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
      <Send className="w-5 h-5 text-blue-600" />
      Send Us a Message
    </h2>

    <div className="space-y-4 flex-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField("")}
            className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
              focusedField === "name" ? "border-blue-500 shadow-md" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:shadow-md`}
            required
          />
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField("")}
            className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
              focusedField === "email" ? "border-blue-500 shadow-md" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:shadow-md`}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField("")}
            className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
              focusedField === "phone" ? "border-blue-500 shadow-md" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:shadow-md`}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("company")}
            onBlur={() => setFocusedField("")}
            className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
              focusedField === "company" ? "border-blue-500 shadow-md" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:shadow-md`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Service Interest *</label>
          <select
            name="serviceInterest"
            value={formData.serviceInterest}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-200"
            required
          >
            <option>General Inquiry</option>
            <option>Construction</option>
            <option>Cleaning Services</option>
            <option>Building Maintenance</option>
            <option>Interior Design</option>
            <option>Production Workshop</option>
          
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("subject")}
            onBlur={() => setFocusedField("")}
            className={`w-full border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
              focusedField === "subject" ? "border-blue-500 shadow-md" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 focus:shadow-md`}
            required
          />
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          onFocus={() => setFocusedField("message")}
          onBlur={() => setFocusedField("")}
          rows={4}
          className={`w-full h-full min-h-[80px] border-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
            focusedField === "message" ? "border-blue-500 shadow-md" : "border-gray-300"
          } focus:outline-none focus:border-blue-500 focus:shadow-md resize-none`}
          required
        />
      </div>
    </div>

    <div className="flex justify-center pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-8 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </div>
  </form>
</div>
      </div>
    </section>
          {/* Map Section */}
          <section className="py-12 bg-white backdrop-blur-sm relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold text-black">
                  Visit Our{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">
                    Office
                  </span>
                </h2>
                <p className="text-xl text-black max-w-3xl mx-auto">
                  Located in the heart of Kigali, we're easily accessible and ready to meet with you.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md h-96 flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <iframe
                    title="Omega Sir Office Map"
                    src="https://www.google.com/maps?q=Kimironko+Gasabo+Kigali+Rwanda&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: "1rem", minHeight: "350px" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Floating particles */}
                <div
                  className="absolute top-2 left-2 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-4 right-3 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-3 left-4 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                  style={{ animationDelay: "1.5s" }}
                ></div>
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
