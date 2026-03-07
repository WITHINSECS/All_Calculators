import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, Eye, Pencil, Plus, Tag } from "lucide-react";

import DeleteBlogButton from "@/components/DeleteBlogButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getBlogPosts } from "@/lib/blog";
import type { BlogPostRecord } from "@/lib/blog-shared";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AllBlogsPage() {
    let posts: BlogPostRecord[] = [];
    let errorMessage = "";

    try {
        posts = await getBlogPosts();
    } catch (error) {
        errorMessage =
            error instanceof Error ? error.message : "Failed to load blog posts.";
    }

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">All Blogs</h1>
                    <p className="text-sm text-muted-foreground">
                        Review published posts, update drafts, and remove old content.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">Total: {posts.length}</Badge>
                    <Button asChild>
                        <Link href="/dashboard/blog">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Post
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Blog Library</CardTitle>
                        <CardDescription>Newest articles are listed first.</CardDescription>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        {posts.filter((post) => post.isPublished).length} published
                    </span>
                </CardHeader>

                <CardContent>
                    {errorMessage ? (
                        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                            {errorMessage}
                        </div>
                    ) : null}

                    <ScrollArea className="h-[520px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Post</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="relative h-14 w-14 overflow-hidden rounded-md border bg-muted">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="56px"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="line-clamp-1 text-sm font-medium">
                                                        {post.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        /blog/{post.slug}
                                                    </p>
                                                    <p className="line-clamp-2 max-w-md text-xs text-muted-foreground">
                                                        {post.excerpt}
                                                    </p>
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
                                                    {post.category}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {post.date}
                                                </span>
                                                <span>
                                                    Updated{" "}
                                                    {post.updatedAt
                                                        ? new Date(post.updatedAt).toLocaleDateString("en-US", {
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
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/blog/${post.slug}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Preview
                                                    </Link>
                                                </Button>
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/dashboard/blog/${post.id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <DeleteBlogButton blogId={post.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {posts.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-12 text-center text-sm text-muted-foreground"
                                        >
                                            No blog posts yet.
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
