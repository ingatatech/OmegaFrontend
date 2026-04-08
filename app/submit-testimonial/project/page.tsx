
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SubmitForm from "./SubmitForm"

function SubmitContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) return null;

  return <SubmitForm projectId={id} />
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SubmitContent />
    </Suspense>
  )
}
