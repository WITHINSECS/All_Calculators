"use client";

import { useEffect, useMemo, useState } from "react";
import Wrapper from "@/app/Wrapper";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowRightIcon, Loader2, SearchIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    category: string;
    date: string;
    imageUrl: string;
    excerpt: string;
}

// small debounce hook (no extra library)
function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function Page() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    // handy flag for UI
    const isSearching = useMemo(
        () => search.trim().length > 0 && debouncedSearch !== search,
        [search, debouncedSearch]
    );

    const fetchPosts = async (searchTerm?: string) => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get("/api/admin/blog", {
                params: searchTerm?.trim() ? { search: searchTerm.trim() } : {},
            });

            if (!res.data?.success) {
                setError(res.data?.message || "Failed to load posts");
                setPosts([]);
                return;
            }

            setPosts(res.data.posts || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Something went wrong");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // initial load + debounced search
    useEffect(() => {
        fetchPosts(debouncedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // immediate search on button click/enter
        fetchPosts(search);
    };

    return (
        <Wrapper>
            <div className="relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 md:mt-16 mt-10 2xl:max-w-[1400px]">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Blogs</h1>
                        <p className="text-muted-foreground mt-3 text-xl">
                            Stay in the know with insights from industry experts.
                        </p>

                        <div className="relative mx-auto mt-7 max-w-xl sm:mt-12">
                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="bg-background relative z-10 flex space-x-3 rounded-lg border p-3 shadow-lg">
                                    <div className="flex-[1_0_0%]">
                                        <Label htmlFor="article" className="sr-only">
                                            Search article
                                        </Label>
                                        <Input
                                            name="article"
                                            className="h-full"
                                            id="article"
                                            placeholder="Search article"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex-[0_0_auto] flex items-center gap-2">
                                        {isSearching ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : null}

                                        <Button size="icon" type="submit" disabled={loading}>
                                            <SearchIcon />
                                        </Button>
                                    </div>
                                </div>
                            </form>
                            {/* End Form */}

                            {/* (Your SVGs remain same) */}
                            {/* ... keep your SVG elements exactly as you already have ... */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative max-w-7xl w-full mx-auto overflow-hidden">
                {/* Loading / Error */}
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {debouncedSearch.trim() ? "Searching posts..." : "Loading posts..."}
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
                                        <Link href={`/blog/${post.slug}`} className="flex items-center justify-center">
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
                            {debouncedSearch.trim()
                                ? `No posts found for "${debouncedSearch}".`
                                : "No blog posts yet."}
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}
