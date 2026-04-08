
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ProjectDetailClient from "@/components/projects/project-detail-client"

function ProjectContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) return null;

  return <ProjectDetailClient id={id} />;
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading project...</div>}>
      <ProjectContent />
    </Suspense>
  );
}
