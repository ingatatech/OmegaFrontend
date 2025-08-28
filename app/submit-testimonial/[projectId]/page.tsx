
import { fetchProjects } from "@/lib/api"
import SubmitForm from "./SubmitForm"

interface Props {
  params: { projectId: string }
}

export default function Page({ params }: Props) {
  return <SubmitForm projectId={params.projectId} />
}

export async function generateStaticParams() {
  const projects = await fetchProjects()
  return projects.map((project: { id: string }) => ({
    projectId: project.id,
  }))
}
