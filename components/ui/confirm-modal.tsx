import React from "react";
import { Button } from "./button";

interface ConfirmModalProps {
	open: boolean;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	color?: string; // Tailwind gradient classes
}

export default function ConfirmModal({
	open,
	title = "Are you sure?",
	description = "This action cannot be undone.",
	confirmText = "Delete",
	cancelText = "Cancel",
	onConfirm,
	onCancel,
	color = "from-red-500 to-pink-600", // default for blog
}: ConfirmModalProps) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
				<h2 className="text-xl font-bold mb-4 text-sky-900">{title}</h2>
				<p className="text-sky-800 mb-6">{description}</p>
				<div className="flex gap-3">
					<Button onClick={onConfirm} className={`flex-1 bg-gradient-to-r ${color} text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300`}>
						{confirmText}
					</Button>
					<Button onClick={onCancel} variant="outline" className="flex-1 border-sky-200 text-sky-700 hover:bg-sky-50">
						{cancelText}
					</Button>
				</div>
			</div>
		</div>
	);
}
