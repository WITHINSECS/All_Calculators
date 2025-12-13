import Wrapper from "@/app/Wrapper";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DBconnection } from "@/lib/db";
import BlogPost from "@/models/blog";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    await DBconnection();

    // ✅ Next 15 fix
    const { id } = await props.params;

    const post = await BlogPost.findOne({ slug: id, isPublished: true }).lean();

    if (!post) notFound();

    const recentPosts = await BlogPost.find({
        isPublished: true,
        _id: { $ne: post._id },
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title slug date category imageUrl")
        .lean();

    return (
        <Wrapper>
            <section className="w-full py-12">
                <div className="container mx-auto px-4 md:px-6">
                    {/* ✅ important: align items to start in grid for sticky to work properly */}
                    <div className="grid w-full gap-8 pt-4 lg:grid-cols-3 lg:items-start">
                        <Card className="col-span-full flex flex-col overflow-hidden pt-0 lg:col-span-2">
                            <div className="relative w-full overflow-hidden">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    width={1200}
                                    height={800}
                                    className="w-full object-cover"
                                    priority
                                />
                            </div>

                            <CardHeader className="flex-1">
                                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {post.date}
                                    </span>
                                    <span>•</span>
                                    <span>{post.category}</span>
                                </div>

                                <CardTitle className="mb-3 text-2xl">{post.title}</CardTitle>

                                <CardDescription className="whitespace-pre-wrap text-base leading-7">
                                    {post.content || post.excerpt}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* ✅ sticky only on lg+ + ensure it can size to content */}
                        <div className="col-span-full space-y-4 self-start lg:col-span-1 lg:sticky lg:top-10">
                            <h3 className="border-b pb-2 text-lg font-medium">Recent Articles</h3>

                            <div className="space-y-6">
                                {recentPosts.map((p: any) => (
                                    <div key={p._id.toString()} className="group">
                                        <div className="flex items-start gap-4">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                <Image
                                                    src={p.imageUrl || "/placeholder.png"}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
                                                    <Link href={`/blog/${p.slug}`} className="hover:underline">
                                                        {p.title}
                                                    </Link>
                                                </h4>

                                                <div className="text-muted-foreground flex items-center text-xs">
                                                    <span>{p.date}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{p.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button asChild variant="outline" className="w-full">
                                <Link href="/blog">View All Blogs</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Wrapper>
    );
}
