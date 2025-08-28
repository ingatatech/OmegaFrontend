import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import React from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	onBlur?:(value: string) => void;
	placeholder?: string;
}

export default function RichTextEditor({ value, onChange,onBlur, placeholder }: RichTextEditorProps) {
	return <ReactQuill value={value} onChange={onChange} onBlur={onBlur} theme="snow" placeholder={placeholder || "Write something..."} style={{ minHeight: 180 }} />;
}
