"use client";

import { use, useEffect, useRef, useState } from "react";
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

import {
    Loader2,
    Save,
    ImageIcon,
    CalendarIcon,
    Upload,
    X,
} from "lucide-react";

export default function EditBlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = use(params);

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [pickedDate, setPickedDate] = useState<Date | undefined>(undefined);
    const [imageUrl, setImageUrl] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await axios.get(`/api/admin/blog/${id}`);
                const post = res.data?.data;

                setTitle(post.title || "");
                setCategory(post.category || "");
                setExcerpt(post.excerpt || "");
                setContent(post.content || "");
                setImageUrl(post.imageUrl || "");

                if (post.date) {
                    setPickedDate(new Date(post.date));
                }
            } catch {
                setError("Failed to load blog post");
            }
        }

        fetchPost();
    }, [id, router]);

    const dateString = pickedDate ? format(pickedDate, "MMMM dd, yyyy") : "";

    const canSubmit =
        title.trim() &&
        category.trim() &&
        dateString.trim() &&
        imageUrl.trim() &&
        excerpt.trim() &&
        !uploadingImage;

    async function handlePickImage() {
        fileInputRef.current?.click();
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);

            const uniqueName = `blog-images/${crypto.randomUUID()}-${file.name}`;

            const blob = await upload(uniqueName, file, {
                access: "public",
                handleUploadUrl: "/api/admin/blog/upload",
            });

            setImageUrl(blob.url);
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
            setError("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.put(`/api/admin/blog/${id}`, {
                title,
                category,
                date: dateString,
                imageUrl,
                excerpt,
                content,
            });

            if (!res.data?.success) {
                setError(res.data?.message || "Update failed");
                return;
            }

            setSuccessMsg("Blog post updated successfully");
            router.refresh();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Blog Post</h1>
                    <p className="text-sm text-muted-foreground">
                        Update your blog post details.
                    </p>
                </div>
                <Badge>Edit</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit post</CardTitle>
                    <CardDescription>Modify fields and save changes.</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-5">
                        <div className="grid gap-2">
                            <Label>Title *</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label>Category *</Label>
                                <Input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {pickedDate ? format(pickedDate, "PPP") : "Pick date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={pickedDate}
                                            onSelect={setPickedDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Featured Image *</Label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePickImage}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    Upload
                                </Button>

                                {imageUrl && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setImageUrl("")}
                                    >
                                        <X className="h-4 w-4" />
                                        Remove
                                    </Button>
                                )}
                            </div>

                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    className="rounded-lg border max-w-lg"
                                />
                            ) : (
                                <div className="border border-dashed p-4 text-sm flex gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    No image selected
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label>Excerpt *</Label>
                            <Textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Content</Label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[180px]"
                            />
                        </div>

                        {error && (
                            <div className="border border-destructive/40 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="border border-emerald-500/40 p-3 text-sm text-emerald-600">
                                {successMsg}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={!canSubmit || loading}>
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
