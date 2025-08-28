
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"}/blogs`)
  const data = await res.json()
  const blogs = data?.blogs|| data || []
  return blogs?.map((blog: { id: string }) => ({ id: blog.id }))
}

import BlogDetailClient from "@/components/blog/blog-detail-client"

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  return <BlogDetailClient id={params.id} />
}
