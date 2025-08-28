import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api",
});

// Automatically attach JWT if present
api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers = config.headers || {};
			config.headers["Authorization"] = `${token}`;
		}
	}
	return config;
});
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log("AXIOS ERROR:", error);
		if (error?.response?.status === 401 && error?.response?.data?.message === "Token is not valid") {
			console.log("Logging out due to invalid token");
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			window.location.href = "/admin/login";
		}
		return Promise.reject(error);
	}
);
export default api;
