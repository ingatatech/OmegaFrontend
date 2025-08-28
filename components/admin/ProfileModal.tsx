import React, { useEffect, useState } from "react";
import { fetchCurrentUser, updateProfile, changePassword } from "@/lib/api";

interface ProfileModalProps {
	onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const user = await fetchCurrentUser();
				setName(user.name || "");
				setEmail(user.email || "");
			} catch (err) {
				setError("Failed to fetch user info");
			}
		}
		fetchUser();
	}, []);

	async function handleProfileSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		try {
			await updateProfile({ name });
			setSuccess("Profile updated successfully.");
		} catch (err) {
			setError("Failed to update profile.");
		}
	}

	async function handlePasswordSubmit(e: React.FormEvent) {
		e.preventDefault();
		setPasswordError(null);
		setPasswordSuccess(null);
		if (newPassword !== confirmPassword) {
			setPasswordError("New passwords do not match.");
			return;
		}
		try {
			await changePassword({ currentPassword, newPassword });
			setPasswordSuccess("Password changed successfully.");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			setPasswordError("Failed to change password.");
		}
	}

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
				<button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
					<span className="text-xl font-bold text-gray-600">×</span>
				</button>
				<div className="p-8">
					<h1 className="text-3xl font-bold mb-6 text-sky-900">Update Profile</h1>
					<form onSubmit={handleProfileSubmit} className="space-y-6 mb-10">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
							<input
								type="text"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed" value={email} disabled />
						</div>
						{error && <div className="text-red-500 text-sm">{error}</div>}
						{success && <div className="text-green-600 text-sm">{success}</div>}
						<button type="submit" className="w-full bg-sky-700 text-white py-2 rounded-lg font-semibold hover:bg-sky-900 transition">
							Update Profile
						</button>
					</form>
					<h2 className="text-2xl font-bold mb-4 text-sky-900">Change Password</h2>
					<form onSubmit={handlePasswordSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
							<input
								type="password"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
							<input
								type="password"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
							<input
								type="password"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>
						{passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
						{passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
						<button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary transition">
							Change Password
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
