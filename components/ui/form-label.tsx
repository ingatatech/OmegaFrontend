interface FormLabelProps {
	children: React.ReactNode;
	required?: boolean;
	className?: string;
}

export default function FormLabel({ children, required = false, className = "" }: FormLabelProps) {
	return (
		<label className={`block text-sky-900 font-semibold mb-2 ${className}`}>
			{children}
			{required && <span className="text-red-500 ml-1">*</span>}
		</label>
	);
}
