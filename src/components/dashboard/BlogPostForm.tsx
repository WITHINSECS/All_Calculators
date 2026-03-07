"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { format } from "date-fns";
import {
    AlertCircle,
    CalendarIcon,
    CheckCircle2,
    ImageIcon,
    Loader2,
    Save,
    Send,
    Upload,
    X,
} from "lucide-react";

import type { BlogPostRecord } from "@/lib/blog-shared";
import { slugify } from "@/lib/blog-shared";
import RichTextEditor from "@/components/dashboard/RichTextEditor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type BlogPostFormProps = {
    mode: "create" | "edit";
    blogId?: string;
    initialValues?: Partial<BlogPostRecord>;
};

function createEmptyState() {
    return {
        title: "",
        slug: "",
        category: "",
        date: undefined as Date | undefined,
        imageUrl: "",
        excerpt: "",
        content: "",
        isPublished: true,
    };
}

function getInitialDate(value?: string) {
    if (!value) {
        return undefined;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function BlogPostForm({
    mode,
    blogId,
    initialValues,
}: BlogPostFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [slug, setSlug] = useState(initialValues?.slug ?? "");
    const [category, setCategory] = useState(initialValues?.category ?? "");
    const [date, setDate] = useState<Date | undefined>(getInitialDate(initialValues?.date));
    const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
    const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
    const [content, setContent] = useState(initialValues?.content ?? "");
    const [isPublished, setIsPublished] = useState(initialValues?.isPublished ?? true);
    const [hasCustomSlug, setHasCustomSlug] = useState(Boolean(initialValues?.slug));

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (hasCustomSlug) {
            return;
        }

        setSlug(slugify(title));
    }, [title, hasCustomSlug]);

    useEffect(() => {
        if (!initialValues) {
            return;
        }

        setTitle(initialValues.title ?? "");
        setSlug(initialValues.slug ?? "");
        setCategory(initialValues.category ?? "");
        setDate(getInitialDate(initialValues.date));
        setImageUrl(initialValues.imageUrl ?? "");
        setExcerpt(initialValues.excerpt ?? "");
        setContent(initialValues.content ?? "");
        setIsPublished(initialValues.isPublished ?? true);
        setHasCustomSlug(Boolean(initialValues.slug));
    }, [initialValues]);

    const dateLabel = useMemo(() => {
        return date ? format(date, "MMMM dd, yyyy") : "";
    }, [date]);

    const canSubmit = Boolean(
        title.trim() &&
            slug.trim() &&
            category.trim() &&
            dateLabel &&
            imageUrl.trim() &&
            excerpt.trim() &&
            !loading &&
            !uploadingImage
    );

    const pageTitle = mode === "create" ? "Create Blog Post" : "Edit Blog Post";
    const pageDescription =
        mode === "create"
            ? "Write, format, upload, and publish a new article from the dashboard."
            : "Update the article content, image, status, and metadata.";

    const submitLabel = mode === "create" ? "Publish Post" : "Save Changes";

    const resetForm = () => {
        const emptyState = createEmptyState();
        setTitle(emptyState.title);
        setSlug(emptyState.slug);
        setCategory(emptyState.category);
        setDate(emptyState.date);
        setImageUrl(emptyState.imageUrl);
        setExcerpt(emptyState.excerpt);
        setContent(emptyState.content);
        setIsPublished(emptyState.isPublished);
        setHasCustomSlug(false);
    };

    const handleSlugChange = (value: string) => {
        const nextSlug = slugify(value);
        setSlug(nextSlug);
        setHasCustomSlug(nextSlug.length > 0);
    };

    const handleChooseImage = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image is too large. Use a file under 5MB.");
            event.target.value = "";
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            setUploadingImage(true);

            const extension = file.name.split(".").pop() ?? "jpg";
            const pathname = `blog-images/${crypto.randomUUID()}.${extension}`;

            const blob = await upload(pathname, file, {
                access: "public",
                handleUploadUrl: "/api/admin/blog/upload",
                contentType: file.type,
            });

            setImageUrl(blob.url);
        } catch (uploadError) {
            const message =
                uploadError instanceof Error ? uploadError.message : "Image upload failed.";
            setError(message);
        } finally {
            setUploadingImage(false);
            event.target.value = "";
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!canSubmit) {
            setError("Title, slug, category, date, featured image, and excerpt are required.");
            return;
        }

        const endpoint = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${blogId}`;
        const method = mode === "create" ? "POST" : "PUT";

        try {
            setLoading(true);

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                    slug: slug.trim(),
                    category: category.trim(),
                    date: dateLabel,
                    imageUrl: imageUrl.trim(),
                    excerpt: excerpt.trim(),
                    content,
                    isPublished,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setError(result.message ?? "Failed to save blog post.");
                return;
            }

            setSuccess(result.message ?? "Blog post saved successfully.");

            if (mode === "create") {
                resetForm();
            } else {
                router.refresh();
            }
        } catch (submitError) {
            const message =
                submitError instanceof Error ? submitError.message : "Failed to save blog post.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
                    <p className="text-sm text-muted-foreground">{pageDescription}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">Dashboard</Badge>
                    <Badge>{mode === "create" ? "New Article" : "Editing"}</Badge>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Article Details</CardTitle>
                    <CardDescription>
                        The toolbar below supports headings, bold, italic, underline, lists,
                        block quotes, and links.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="How to Build Better Marketing Reporting"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    placeholder="how-to-build-better-marketing-reporting"
                                    value={slug}
                                    onChange={(event) => handleSlugChange(event.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL preview: /blog/{slug || "your-post-slug"}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-[1fr_220px]">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="Marketing, Analytics, SEO"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="outline" className="justify-start">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            captionLayout="dropdown"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-4 py-3">
                                <div>
                                    <Label htmlFor="publish-switch" className="block">
                                        Published
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Turn this off to save the post as a draft.
                                    </p>
                                </div>
                                <Switch
                                    id="publish-switch"
                                    checked={isPublished}
                                    onCheckedChange={setIsPublished}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label>Featured Image</Label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleChooseImage}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Image
                                        </>
                                    )}
                                </Button>

                                {imageUrl ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setImageUrl("")}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Remove Image
                                    </Button>
                                ) : null}
                            </div>

                            {imageUrl ? (
                                <div className="relative overflow-hidden rounded-lg border">
                                    <Image
                                        src={imageUrl}
                                        alt="Blog cover preview"
                                        width={1200}
                                        height={630}
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    <ImageIcon className="h-4 w-4" />
                                    Upload a 16:9 cover image for the article card and page header.
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                placeholder="Short summary shown on the blog cards and listing page..."
                                value={excerpt}
                                onChange={(event) => setExcerpt(event.target.value)}
                                className="min-h-[110px]"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Article Content</Label>
                            <RichTextEditor value={content} onChange={setContent} />
                        </div>

                        {error ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Could not save the blog post</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : null}

                        {success ? (
                            <Alert>
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertTitle>Saved</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        ) : null}
                    </CardContent>

                    <CardFooter className="mt-6 flex flex-wrap items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/allblogs")}>
                            Back to All Blogs
                        </Button>

                        <Button type="submit" disabled={!canSubmit}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === "create" ? "Publishing..." : "Saving..."}
                                </>
                            ) : mode === "create" ? (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    {submitLabel}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {submitLabel}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
