
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"}/projects`)
  const data = await res.json()
  const projects = data || []
  return projects.map((project: { id: string }) => ({ id: project.id }))
}

import ProjectDetailClient from "@/components/projects/project-detail-client"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return <ProjectDetailClient id={params.id} />
}
