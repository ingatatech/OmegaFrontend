"use client"
import { useState } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/api"
import toast from "react-hot-toast"
import VideoBackground from "../video-background"
import Link from "next/link"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })

  const validateForm = () => {
    const newErrors = { email: "", password: "" }
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      toast.success("Welcome back! Login successful")

      // Add a small delay for better UX
      setTimeout(() => {
        window.location.href = "/admin"
      }, 500)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <VideoBackground/>
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/30 to-primary/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 p-8 text-center">
        <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl mb-1"
            >
              <img src="/favicon.png" alt="Logo" className="w-8 h-8" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white mb-1"
            >
              OMEGA SIR Admin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-sm"
            >
              Secure access to your dashboard
            </motion.p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    placeholder="admin@omegasir.com"
                    className={`pl-12 h-12 border-2 transition-all duration-300 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 focus:border-primary focus:ring-primary/20"
                    }`}
                    disabled={loading}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    placeholder="Enter your password"
                    className={`pl-12 pr-12 h-12 border-2 transition-all duration-300 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 focus:border-primary focus:ring-primary/20"
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

            <div className="flex justify-end">
              <Link
                href="/admin/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

              {/* Submit Button */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

      
          </div>
        </div>

 
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 right-32 w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm hidden lg:block"
      />
    </div>
    </>
  )
}
