"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<Button
			onClick={scrollToTop}
			className="fixed bottom-3 right-3 z-50 bg-gradient-to-r from-sky-500 via-blue-600 to-sky-900 hover:from-sky-600 hover:via-blue-700 hover:to-sky-800 text-white rounded-full w-12 h-12 p-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 group/button overflow-hidden animate-bounce-gentle"
			aria-label="Scroll to top"
		>
			{/* Button content */}
			<div className="relative z-10 flex items-center justify-center">
				<ChevronUp className="h-6 w-6 group-hover/button:scale-110 transition-transform duration-300" />
			</div>
		</Button>
	);
}
