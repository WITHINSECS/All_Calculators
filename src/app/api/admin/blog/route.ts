import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import { getBlogPosts } from "@/lib/blog";
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

async function buildUniqueSlug(input: string) {
    const baseSlug = slugify(input) || `blog-post-${Date.now()}`;
    let candidate = baseSlug;
    let counter = 1;

    while (await BlogPost.exists({ slug: candidate })) {
        candidate = `${baseSlug}-${counter++}`;
    }

    return candidate;
}

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") ?? "";
        const limitValue = Number.parseInt(searchParams.get("limit") ?? "", 10);
        const publishedOnly = searchParams.get("publishedOnly") === "true";

        const posts = await getBlogPosts({
            search,
            limit: Number.isNaN(limitValue) ? undefined : limitValue,
            publishedOnly,
        });

        return NextResponse.json(
            {
                success: true,
                posts,
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to fetch blog posts.");
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        await DBconnection();

        const body = await request.json();

        const title = String(body.title ?? "").trim();
        const category = String(body.category ?? "").trim();
        const date = String(body.date ?? "").trim();
        const imageUrl = String(body.imageUrl ?? "").trim();
        const excerptInput = stripHtml(String(body.excerpt ?? ""));
        const content = sanitizeBlogContentHtml(String(body.content ?? ""));
        const slugInput = String(body.slug ?? title);
        const isPublished = typeof body.isPublished === "boolean" ? body.isPublished : true;
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

        const slug = await buildUniqueSlug(slugInput);

        const created = await BlogPost.create({
            title,
            slug,
            category,
            date,
            imageUrl,
            excerpt,
            content,
            isPublished,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Blog post created successfully.",
                data: serializeBlogPost(created.toObject()),
            },
            { status: 201 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to create blog post.");
    }
}
