"use client";

import { useEffect, useState } from "react";
import Wrapper from "@/app/Wrapper";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowRightIcon, Loader2 } from "lucide-react";

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    category: string;
    date: string;
    imageUrl: string;
    excerpt: string;
}

export default function Page() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get("/api/admin/blog");

                if (!res.data?.success) {
                    setError(res.data?.message || "Failed to load posts");
                    return;
                }

                setPosts(res.data.posts || []);
            } catch (err: any) {
                setError(
                    err?.response?.data?.message || err?.message || "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Wrapper>
            <div className="relative max-w-7xl w-full mx-auto overflow-hidden">
                {/* Loading / Error */}
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading posts...
                    </div>
                ) : error ? (
                    <div className="py-10 text-center text-sm text-destructive">{error}</div>
                ) : null}

                {/* Posts grid */}
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-y-4 lg:px-12 grid-cols-1 md:my-16 my-8">
                    {posts.map((post) => (
                        <div key={post._id} className="w-full sm:px-2 px-4">
                            <Card className="flex h-full flex-col overflow-hidden p-0 shadow-sm transition-shadow hover:shadow-md">
                                <div className="relative h-40 overflow-hidden sm:h-48 md:h-52">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-primary hover:bg-primary/90">
                                            {post.category}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="flex-grow">
                                    <div className="text-muted-foreground mb-2 flex items-center text-xs sm:mb-3 sm:text-sm">
                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="mb-2 line-clamp-2 text-base font-semibold sm:text-lg">
                                        {post.title}
                                    </h3>
                                    <p className="text-muted-foreground line-clamp-2 text-xs sm:line-clamp-3 sm:text-sm">
                                        {post.excerpt}
                                    </p>
                                </CardContent>

                                <CardFooter className="pb-6">
                                    <Button variant="ghost" size="sm" className="w-full text-sm" asChild>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="flex items-center justify-center"
                                        >
                                            Read Article
                                            <ArrowRightIcon className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}

                    {!loading && !error && posts.length === 0 && (
                        <div className="col-span-full text-center text-sm text-muted-foreground py-10">
                            No blog posts yet.
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}
