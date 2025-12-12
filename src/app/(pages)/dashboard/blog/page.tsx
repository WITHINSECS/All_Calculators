"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { upload } from "@vercel/blob/client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Loader2, Send, ImageIcon, CalendarIcon, Upload, X } from "lucide-react";

export default function NewBlogPostPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [pickedDate, setPickedDate] = useState<Date | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState(""); // ✅ will be blob url
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false); // ✅
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const dateString = pickedDate ? format(pickedDate, "MMMM dd, yyyy") : "";

    const canSubmit =
        title.trim() &&
        category.trim() &&
        dateString.trim() &&
        imageUrl.trim() && // ✅ requires upload done
        excerpt.trim() &&
        !uploadingImage;

    async function handlePickImage() {
        fileInputRef.current?.click();
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file (jpg, png, webp, etc).");
            e.target.value = "";
            return;
        }

        const MAX_MB = 5;
        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`Image is too large. Max ${MAX_MB}MB allowed.`);
            e.target.value = "";
            return;
        }

        try {
            setError(null);
            setUploadingImage(true);

            const uniqueName = `blog-images/${crypto.randomUUID()}-${file.name}`;

            // Upload to Vercel Blob via your route
            const blob = await upload(uniqueName, file, {
                access: "public",
                handleUploadUrl: "/api/admin/blog/upload",
            });

            setImageUrl(blob.url); // ✅ this is what you store in DB
        } catch (err: any) {
            setError(err?.message || "Image upload failed");
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!canSubmit) {
            setError("Please fill: title, category, date, image, excerpt.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post("/api/admin/blog", {
                title,
                category,
                date: dateString,
                imageUrl, // ✅ blob url
                excerpt,
                content,
                isPublished: true,
            });

            if (!res.data?.success) {
                setError(res.data?.message || "Failed to create blog post");
                return;
            }

            setSuccessMsg(res.data?.message || "Blog post created successfully!");

            setTitle("");
            setCategory("");
            setPickedDate(undefined);
            setImageUrl("");
            setExcerpt("");
            setContent("");

            router.refresh();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while creating blog post";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Blog Post</h1>
                    <p className="text-sm text-muted-foreground">
                        Add a new blog post that will appear on your blog page.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">Dashboard</Badge>
                    <Badge>Create</Badge>
                </div>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">New post</CardTitle>
                    <CardDescription>Fill the details below and click “Publish”.</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-5">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g. How Marketing Analytics is Reshaping Business Strategies"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Category + Date */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category *</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g. Analytics"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="outline" className="justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {pickedDate ? format(pickedDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={pickedDate}
                                            onSelect={setPickedDate}
                                            initialFocus
                                            captionLayout="dropdown"
                                        />
                                    </PopoverContent>
                                </Popover>

                                {dateString ? (
                                    <p className="text-xs text-muted-foreground">
                                        Saved as: <span className="font-medium">{dateString}</span>
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* ✅ Image Upload (Vercel Blob) */}
                        <div className="grid gap-2">
                            <Label>Featured Image *</Label>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePickImage}
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
                                        className="text-muted-foreground"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Remove
                                    </Button>
                                ) : null}
                            </div>

                            {/* Preview */}
                            {imageUrl ? (
                                <div className="mt-2 overflow-hidden rounded-lg border">
                                    <img src={imageUrl} alt="Preview" className="mx-auto max-w-lg w-full object-cover" />
                                </div>
                            ) : (
                                <div className="mt-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Upload an image to generate the image URL automatically.
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div className="grid gap-2">
                            <Label htmlFor="excerpt">Excerpt *</Label>
                            <Textarea
                                id="excerpt"
                                placeholder="Short summary shown on the blog listing page..."
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                className="min-h-[90px]"
                            />
                        </div>

                        {/* Content */}
                        <div className="grid gap-2">
                            <Label htmlFor="content">Full Content (optional)</Label>
                            <Textarea
                                id="content"
                                placeholder="Write the full blog article here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[180px]"
                            />
                        </div>

                        {error ? (
                            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        ) : null}

                        {successMsg ? (
                            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-600">
                                {successMsg}
                            </div>
                        ) : null}
                    </CardContent>

                    <CardFooter className="flex items-center justify-end gap-2 mt-10">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={!canSubmit || loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Publish
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
