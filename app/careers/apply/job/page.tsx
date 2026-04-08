"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import JobApplicationClient from "@/components/jobs/job-application-client"

function JobContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) return null;

  return <JobApplicationClient jobId={id} />
}

export default function JobApplicationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading application...</div>}>
      <JobContent />
    </Suspense>
  )
}
