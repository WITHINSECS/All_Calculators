import { notFound } from "next/navigation";

import BlogPostForm from "@/components/dashboard/BlogPostForm";
import { getBlogPostById } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function EditBlogPostPage(props: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await props.params;
    const post = await getBlogPostById(id);

    if (!post) {
        notFound();
    }

    return <BlogPostForm mode="edit" blogId={id} initialValues={post} />;
}
