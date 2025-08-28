export interface Testimonial {
  id: string
  leaderName: string
  companyName: string
  role: string
  quote: string
  leaderImage: string // URL to image
  projectId: string // ID of the associated project
project: Project
  approved: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  category: { id: string; name: string }
  imageAfter: string
  imageBefore: string
  gallery: string[]
  location: string
  creator: { id: string; name: string }
  testimonials: Testimonial[] // Array of testimonials associated with this project
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Partners {
  id: string
  name: string
  image: string
}


export interface JobApplication {
  id: string
  fullName: string
  email: string
  phone: string
  resume: string
  coverLetter?: string
  status: "pending" | "rejected" | "successful"
  job: Job
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  preferred?: string[]
  benefits?: string[]
  deadline: string
  status: "active" | "closed"
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface FAQCategory {
  name: string
  icon: any
  count: number
}
