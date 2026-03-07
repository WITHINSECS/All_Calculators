"use client";

import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRightIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";

import type { BlogPostRecord } from "@/lib/blog-shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function BlogSectionSlider() {
    const [blogPosts, setBlogPosts] = useState<BlogPostRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [startX, setStartX] = useState(0);
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    });

    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchPosts = async () => {
            try {
                setLoading(true);

                const response = await fetch("/api/blog?limit=6", {
                    cache: "no-store",
                });
                const result = await response.json();

                if (!response.ok || !result.success || cancelled) {
                    return;
                }

                setBlogPosts(result.posts ?? []);
            } catch (error) {
                console.error("Failed to load blog posts for home page:", error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchPosts();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;

            setScreenSize({
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isDesktop: width >= 1024,
            });
        };

        updateScreenSize();
        window.addEventListener("resize", updateScreenSize);

        return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    const visibleItems = screenSize.isDesktop ? 3 : screenSize.isTablet ? 2 : 1;

    const maxIndex = useMemo(() => {
        return Math.max(0, blogPosts.length - visibleItems);
    }, [blogPosts.length, visibleItems]);

    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxIndex));
    }, [maxIndex]);

    useEffect(() => {
        if (!sliderRef.current) {
            return;
        }

        const scrollToIndex = () => {
            if (!sliderRef.current) {
                return;
            }

            const cardWidth =
                (sliderRef.current.querySelector(".carousel-item") as HTMLElement | null)
                    ?.clientWidth ?? 0;

            sliderRef.current.scrollTo({
                left: cardWidth * currentIndex,
                behavior: "smooth",
            });
        };

        const timeoutId = window.setTimeout(scrollToIndex, 50);
        return () => window.clearTimeout(timeoutId);
    }, [currentIndex, screenSize, blogPosts.length]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        setIsSwiping(true);
        setStartX(event.touches[0].clientX);
    };

    const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
        if (!isSwiping) {
            return;
        }

        const diff = startX - event.touches[0].clientX;

        if (Math.abs(diff) > 5) {
            event.preventDefault();
        }
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        if (!isSwiping) {
            return;
        }

        const diff = startX - event.changedTouches[0].clientX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < maxIndex) {
                handleNext();
            }

            if (diff < 0 && currentIndex > 0) {
                handlePrevious();
            }
        }

        setIsSwiping(false);
    };

    if (loading && blogPosts.length === 0) {
        return (
            <section>
                <div className="container mx-auto space-y-4 px-4 md:px-6 2xl:max-w-[1400px]">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Latest Articles
                        </h2>
                        <p className="text-sm text-muted-foreground md:text-base">
                            Loading articles from the blog dashboard...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!blogPosts.length) {
        return null;
    }

    return (
        <section>
            <div className="container mx-auto space-y-6 px-4 md:space-y-8 md:px-6 2xl:max-w-[1400px]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-md space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Latest Articles
                        </h2>
                        <p className="text-sm text-muted-foreground md:text-base">
                            Fresh articles published from the dashboard
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            aria-label="Previous slide"
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            disabled={currentIndex === maxIndex}
                            aria-label="Next slide"
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        ref={sliderRef}
                        className="scrollbar-hide -mx-4 flex touch-pan-x snap-x snap-mandatory overflow-x-auto px-4 pt-1 pb-2 md:pb-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {blogPosts.map((post) => (
                            <div
                                key={post.id}
                                className="carousel-item w-full flex-none snap-start px-2 sm:w-1/2 sm:px-4 lg:w-1/3"
                            >
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
                    </div>

                    <div className="mt-6 flex justify-center space-x-2 sm:hidden">
                        {Array.from({ length: maxIndex + 1 }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === currentIndex ? "w-6 bg-primary" : "w-2 bg-primary/30"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between sm:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="mr-2 h-9 flex-1 text-xs"
                        >
                            <ChevronLeftIcon className="mr-1 h-4 w-4" />
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNext}
                            disabled={currentIndex === maxIndex}
                            className="ml-2 h-9 flex-1 text-xs"
                        >
                            Next
                            <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="mt-2 flex justify-center sm:mt-8">
                    <Button variant="outline" className="w-full max-w-sm" asChild>
                        <Link href="/blog">Browse All Articles</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
