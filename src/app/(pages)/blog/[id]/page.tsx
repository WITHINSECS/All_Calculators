import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon } from "lucide-react";

import Wrapper from "@/app/Wrapper";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const post = await getBlogPostBySlug(id);

    if (!post) {
        notFound();
    }

    const recentPosts = await getBlogPosts({
        publishedOnly: true,
        excludeSlug: post.slug,
        limit: 5,
    });

    return (
        <Wrapper>
            <section className="w-full py-12">
                <div className="container mx-auto px-4 md:px-6">
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
                                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {post.date}
                                    </span>
                                    <span>|</span>
                                    <span>{post.category}</span>
                                </div>

                                <CardTitle className="mb-3 text-2xl">{post.title}</CardTitle>

                                <p className="mb-6 text-base leading-7 text-muted-foreground">
                                    {post.excerpt}
                                </p>

                                {post.content ? (
                                    <div
                                        className="space-y-4 text-base leading-7 text-card-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
                                        dangerouslySetInnerHTML={{
                                            __html: post.content,
                                        }}
                                    />
                                ) : null}
                            </CardHeader>
                        </Card>

                        <div className="col-span-full space-y-4 self-start lg:col-span-1 lg:sticky lg:top-10">
                            <h3 className="border-b pb-2 text-lg font-medium">Recent Articles</h3>

                            <div className="space-y-6">
                                {recentPosts.map((recentPost) => (
                                    <div key={recentPost.id} className="group">
                                        <div className="flex items-start gap-4">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                <Image
                                                    src={recentPost.imageUrl}
                                                    alt={recentPost.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
                                                    <Link
                                                        href={`/blog/${recentPost.slug}`}
                                                        className="hover:underline"
                                                    >
                                                        {recentPost.title}
                                                    </Link>
                                                </h4>

                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span>{recentPost.date}</span>
                                                    <span className="mx-1">|</span>
                                                    <span>{recentPost.category}</span>
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
