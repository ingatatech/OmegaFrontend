import JobApplicationClient from "@/components/jobs/job-application-client"

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/jobs`)
  const jobs = await res.json()
  const activeJobs = jobs.filter((job: any) => job.status === "active")
  return activeJobs.map((job: { id: string }) => ({ jobId: job.id }))
}


export default function JobApplicationPage({ params }: { params: { jobId: string } }) {
  return <JobApplicationClient jobId={params.jobId} />
}
