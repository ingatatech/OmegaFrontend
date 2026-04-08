
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import BlogDetailClient from "@/components/blog/blog-detail-client"

function BlogContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) return null;

  return <BlogDetailClient id={id} />;
}

export default function BlogDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading blog...</div>}>
      <BlogContent />
    </Suspense>
  );
}
