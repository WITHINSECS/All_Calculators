import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import { deleteManagedBlob } from "@/lib/blob";
import { sanitizeBlogContentHtml, serializeBlogPost, slugify, stripHtml } from "@/lib/blog-shared";
import { DBconnection } from "@/lib/db";
import BlogPost from "@/models/blog";

export const runtime = "nodejs";

function getErrorResponse(error: unknown, fallbackMessage: string) {
    const message = error instanceof Error ? error.message : fallbackMessage;
    const status = message.includes("MongoDB connection failed") ? 503 : 500;

    return NextResponse.json(
        {
            success: false,
            message,
        },
        { status }
    );
}

async function buildUniqueSlug(input: string, currentId: string) {
    const baseSlug = slugify(input) || `blog-post-${Date.now()}`;
    let candidate = baseSlug;
    let counter = 1;

    while (
        await BlogPost.exists({
            slug: candidate,
            _id: { $ne: currentId },
        })
    ) {
        candidate = `${baseSlug}-${counter++}`;
    }

    return candidate;
}

async function resolvePostId(params: Promise<{ id: string }>) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    return id;
}

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const id = await resolvePostId(context.params);

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid blog post ID.",
                },
                { status: 400 }
            );
        }

        await DBconnection();

        const post = await BlogPost.findById(id).lean();

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Blog post not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: serializeBlogPost(post),
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to fetch blog post.");
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const id = await resolvePostId(context.params);

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid blog post ID.",
                },
                { status: 400 }
            );
        }

        await DBconnection();

        const existing = await BlogPost.findById(id);

        if (!existing) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Blog post not found.",
                },
                { status: 404 }
            );
        }

        const body = await request.json();
        const title = String(body.title ?? "").trim();
        const category = String(body.category ?? "").trim();
        const date = String(body.date ?? "").trim();
        const imageUrl = String(body.imageUrl ?? "").trim();
        const excerptInput = stripHtml(String(body.excerpt ?? ""));
        const content = sanitizeBlogContentHtml(String(body.content ?? ""));
        const slug = await buildUniqueSlug(String(body.slug ?? title), id);
        const excerpt = (excerptInput || stripHtml(content)).slice(0, 180);

        if (!title || !category || !date || !imageUrl || !excerpt) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title, category, date, image, and excerpt are required.",
                },
                { status: 400 }
            );
        }

        const previousImageUrl = existing.imageUrl;

        existing.title = title;
        existing.slug = slug;
        existing.category = category;
        existing.date = date;
        existing.imageUrl = imageUrl;
        existing.excerpt = excerpt;
        existing.content = content;
        existing.isPublished =
            typeof body.isPublished === "boolean" ? body.isPublished : existing.isPublished;

        await existing.save();

        if (previousImageUrl && previousImageUrl !== imageUrl) {
            try {
                await deleteManagedBlob(previousImageUrl);
            } catch (cleanupError) {
                console.error("Failed to delete previous blog image:", cleanupError);
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Blog post updated successfully.",
                data: serializeBlogPost(existing.toObject()),
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to update blog post.");
    }
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const id = await resolvePostId(context.params);

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid blog post ID.",
                },
                { status: 400 }
            );
        }

        await DBconnection();

        const deleted = await BlogPost.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Blog post not found.",
                },
                { status: 404 }
            );
        }

        if (deleted.imageUrl) {
            try {
                await deleteManagedBlob(deleted.imageUrl);
            } catch (cleanupError) {
                console.error("Failed to delete blog cover image:", cleanupError);
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Blog post deleted successfully.",
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to delete blog post.");
    }
}
