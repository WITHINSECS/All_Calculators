import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";

import { DBconnection } from "@/lib/db";
import BlogPost from "@/models/blog";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Eye, CalendarIcon, Tag, Plus, Pencil } from "lucide-react";
import DeleteBlogButton from "@/components/DeleteBlogButton";

type BlogRow = {
    _id: string;
    title?: string;
    slug?: string;
    category?: string;
    date?: string;
    imageUrl?: string;
    excerpt?: string;
    isPublished?: boolean;
    createdAt?: string; // ISO string
};

export default async function AllBlogs() {
    // Ensure fresh data on Vercel (prevents caching surprises)
    noStore();

    let posts: BlogRow[] = [];

    try {
        await DBconnection();

        const rawPosts = await BlogPost.find()
            .sort({ createdAt: -1 })
            .select("title slug category date imageUrl excerpt isPublished createdAt")
            .lean();

        posts = (rawPosts || []).map((p: any) => ({
            _id: p?._id?.toString?.() ?? "",
            title: p?.title ?? "",
            slug: p?.slug ?? "",
            category: p?.category ?? "",
            date: p?.date ?? "",
            imageUrl: p?.imageUrl ?? "",
            excerpt: p?.excerpt ?? "",
            isPublished: Boolean(p?.isPublished),
            createdAt: p?.createdAt ? new Date(p.createdAt).toISOString() : "",
        }));
    } catch (err) {
        // In production, failing DB connection can crash the page.
        // We fail gracefully and show "No blog posts yet."
        console.error("AllBlogs page error:", err);
        posts = [];
    }

    const total = posts.length;

    return (
        <div className="w-full p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">All Blogs</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your blog posts and preview what users will see.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">Total: {total}</Badge>

                    <Button asChild variant="outline">
                        <Link href="/dashboard/blog/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Blog Post
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Blog Posts</CardTitle>
                        <CardDescription>Newest posts appear first.</CardDescription>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        {total} posts
                    </span>
                </CardHeader>

                <CardContent>
                    <ScrollArea className="h-[430px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Post</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Meta</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post._id}>
                                        <TableCell className="align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                                                    {post.imageUrl ? (
                                                        <Image
                                                            src={post.imageUrl}
                                                            alt={post.title || "Blog image"}
                                                            fill
                                                            className="object-cover"
                                                            sizes="48px"
                                                        />
                                                    ) : null}
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm font-medium line-clamp-1">
                                                        {post.title || "-"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        /blog/{post.slug || "-"}
                                                    </p>
                                                    {post.excerpt ? (
                                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                                                            {post.excerpt}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top">
                                            {post.isPublished ? (
                                                <Badge>Published</Badge>
                                            ) : (
                                                <Badge variant="secondary">Draft</Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1">
                                                    <Tag className="h-3 w-3" />
                                                    {post.category || "-"}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {post.date || "-"}
                                                </span>
                                                <span>
                                                    {post.createdAt
                                                        ? new Date(post.createdAt).toLocaleString("en-US", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "-"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/blog/${post.slug}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Preview
                                                    </Link>
                                                </Button>

                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/dashboard/blog/${post._id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </Button>

                                                <DeleteBlogButton blogId={post._id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {posts.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-sm text-muted-foreground py-10"
                                        >
                                            No blog posts yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
