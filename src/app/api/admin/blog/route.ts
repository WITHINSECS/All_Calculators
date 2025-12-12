import { DBconnection } from "@/lib/db";
import BlogPost from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

// Simple slug helper
function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
    await DBconnection();

    try {
        const body = await request.json();

        const { title, category, date, imageUrl, excerpt, content, isPublished } =
            body;

        // Basic validation (match fields your UI uses)
        if (!title || !category || !date || !imageUrl || !excerpt) {
            return NextResponse.json(
                {
                    message: "title, category, date, imageUrl, and excerpt are required",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Create a unique slug (based on title)
        const baseSlug = slugify(title);
        let slug = baseSlug;
        let counter = 1;

        while (await BlogPost.exists({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }

        const blogPost = await BlogPost.create({
            title,
            slug,
            category,
            date,
            imageUrl,
            excerpt,
            content: content || "",
            isPublished: typeof isPublished === "boolean" ? isPublished : true,
        });

        return NextResponse.json(
            {
                message: "Blog post created successfully",
                success: true,
                blogPost,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Create blog post error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            {
                message: "Something went wrong while creating blog post",
                success: false,
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}


export async function GET(request: NextRequest) {
    await DBconnection();

    try {
        const { searchParams } = new URL(request.url);
        const search = (searchParams.get("search") || "").trim();

        const filter: any = { isPublished: true };

        // If search is provided, use MongoDB text search
        if (search) {
            filter.$text = { $search: search };
        }

        const query = BlogPost.find(filter)
            .sort(
                search
                    ? { score: { $meta: "textScore" }, createdAt: -1 }
                    : { createdAt: -1 }
            )
            .select(
                search
                    ? { title: 1, slug: 1, category: 1, date: 1, imageUrl: 1, excerpt: 1, createdAt: 1, score: { $meta: "textScore" } }
                    : "title slug category date imageUrl excerpt createdAt"
            );

        const posts = await query.exec();

        return NextResponse.json({ success: true, posts }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, message: "Failed to fetch posts", error: errorMessage },
            { status: 500 }
        );
    }
}

