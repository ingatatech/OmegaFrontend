import api from "./axios";

export async function login(email: string, password: string) {
	const res = await api.post("/users/login", { email, password });
	// Save token and user to localStorage
	if (typeof window !== "undefined") {
		localStorage.setItem("token", res.data.token);
		localStorage.setItem("user", JSON.stringify(res.data.user));
	}
	return res.data.user;
}

// Fetch all jobs
export async function fetchJobs() {
	const res = await api.get("/jobs");
	return res.data;
}

export async function fetchJob(id: string) {
	const res = await api.get(`/jobs/${id}`);
	return res.data;
}



export async function sendContactMessage(data: { name: string; subject: string; email: string; company: string;serviceInterest: string;phone?: string; message: string }) {
	return api.post("/contact-messages", data);
}

export async function fetchContactMessages() {
	return api.get("/contact-messages");
}

export async function updateContactMessageResponded(id: string, responded: boolean) {
	return api.patch(`/contact-messages/${id}/responded`, { responded });
}


// Fetch all projects
export async function fetchProjects() {
	const res = await api.get("/projects");
	return res.data;
}

// Fetch current user profile
export async function fetchCurrentUser() {
	const res = await api.get("/users/profile");
	return res.data;
}

// Update user profile (name)
export async function updateProfile(data: { name: string }) {
	const res = await api.patch("/users/profile", data);
	return res.data;
}

// Change user password
export async function changePassword(data: { currentPassword: string; newPassword: string }) {
	const res = await api.patch("/users/change-password", data);
	return res.data;
}


// Testimonial API functions
export const fetchTestimonials = async () => {
  return await api.get("/testimonials")
}

export const createTestimonial = async (formData: FormData) => {
  return await api.post("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export const updateTestimonial = async (id: string, formData: FormData) => {
  return await api.patch(`/testimonials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export const deleteTestimonial = async (id: string) => {
  return await api.delete(`/testimonials/${id}`)
}

export const fetchTestimonialById = async (id: string) => {
  return await api.get(`/testimonials/${id}`)
}

export const fetchProjectById = async (id: string) => {
  return await api.get(`/projects/${id}`)
}

export const updateTestimonialApprovalStatus= async(id: string, approved: boolean)=> {

 return   await api.patch(`/testimonials/${id}/approval`,approved, {
   
      headers: {
        "Content-Type": "application/json",
      },
    })
  } 
export const submitJobApplication = async (applicationData: {
  jobId: string
  fullName: string
  email: string
  phone: string
  resume: File
  coverLetter: File|null
}) => {
  const formData = new FormData();
  formData.append('jobId', applicationData.jobId);
  formData.append('fullName', applicationData.fullName);
  formData.append('email', applicationData.email);
  formData.append('phone', applicationData.phone);
  formData.append('resume', applicationData.resume);
  if (applicationData.coverLetter) {
    formData.append('coverLetter', applicationData.coverLetter);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"}/job-applications`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to submit application');
  }

  return response.json();
};


// FAQ API functions
export const fetchFAQs = async () => {
  const res = await api.get("/faqs")
  return res.data
}

export const fetchFAQById = async (id: string) => {
  const res = await api.get(`/faqs/${id}`)
  return res.data
}

export const createFAQ = async (data: {
  category: string
  question: string
  answer: string
  tags: string[]
}) => {
  const res = await api.post("/faqs", data)
  return res.data
}

export const updateFAQ = async (
  id: string,
  data: {
    category?: string
    question?: string
    answer?: string
    tags?: string[]
  },
) => {
  const res = await api.patch(`/faqs/${id}`, data)
  return res.data
}

export const deleteFAQ = async (id: string) => {
  return await api.delete(`/faqs/${id}`)
}

export const searchFAQs = async (query: string, category?: string) => {
  const params = new URLSearchParams()
  if (query) params.append("q", query)
  if (category && category !== "All") params.append("category", category)

  const res = await api.get(`/faqs/search?${params.toString()}`)
  return res.data
}

