"use client";

import { useDeferredValue, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CalendarIcon, SearchIcon } from "lucide-react";

import Wrapper from "@/app/Wrapper";
import AdsenseAd from "@/components/AdsenseAd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BlogPostRecord } from "@/lib/blog-shared";

export default function Page() {
    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);
    const [posts, setPosts] = useState<BlogPostRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchPosts = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();

                if (deferredSearch.trim()) {
                    params.set("search", deferredSearch.trim());
                }

                const response = await fetch(`/api/blog?${params.toString()}`, {
                    cache: "no-store",
                    signal: controller.signal,
                });
                const result = await response.json();

                if (!response.ok || !result.success) {
                    setPosts([]);
                    return;
                }

                setPosts(result.posts ?? []);
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Failed to load blog listing:", error);
                    setPosts([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void fetchPosts();

        return () => {
            controller.abort();
        };
    }, [deferredSearch]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
    };

    return (
        <Wrapper>
            <div className="relative overflow-hidden">
                <div className="container mx-auto mt-10 px-4 md:mt-16 md:px-6 2xl:max-w-[1400px]">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Blogs</h1>
                        <p className="mt-3 text-xl text-muted-foreground">
                            Articles published from the dashboard.
                        </p>

                        <div className="relative mx-auto mt-7 max-w-xl sm:mt-12">
                            <form onSubmit={handleSubmit}>
                                <div className="relative z-10 flex space-x-3 rounded-lg border bg-background p-3 shadow-lg">
                                    <div className="flex-[1_0_0%]">
                                        <Label htmlFor="article" className="sr-only">
                                            Search article
                                        </Label>
                                        <Input
                                            id="article"
                                            name="article"
                                            className="h-full"
                                            placeholder="Search article"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-[0_0_auto] items-center gap-2">
                                        <Button size="icon" type="submit">
                                            <SearchIcon />
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <AdsenseAd placement="blogTop" />

            <div className="relative mx-auto my-8 w-full max-w-7xl overflow-hidden md:my-16">
                <div className="grid grid-cols-1 gap-y-4 px-4 sm:grid-cols-2 lg:px-12 md:grid-cols-3">
                    {posts.map((post) => (
                        <div key={post.id} className="w-full sm:px-2">
                            <Card className="flex h-full flex-col overflow-hidden p-0 shadow-sm transition-shadow hover:shadow-md">
                                <div className="relative h-40 overflow-hidden sm:h-48 md:h-52">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute left-3 top-3">
                                        <Badge className="bg-primary hover:bg-primary/90">
                                            {post.category}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="flex-grow">
                                    <div className="mb-2 flex items-center text-xs text-muted-foreground sm:mb-3 sm:text-sm">
                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="mb-2 line-clamp-2 text-base font-semibold sm:text-lg">
                                        {post.title}
                                    </h3>
                                    <p className="line-clamp-2 text-xs text-muted-foreground sm:line-clamp-3 sm:text-sm">
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

                    {posts.length === 0 ? (
                        <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
                            {loading
                                ? "Loading blog posts..."
                                : search.trim()
                                    ? `No posts found for "${search.trim()}".`
                                    : "No blog posts available."}
                        </div>
                    ) : null}
                </div>

                <div className="px-4 pt-8 lg:px-12">
                    <AdsenseAd placement="blogBottom" />
                </div>
            </div>
        </Wrapper>
    );
}
