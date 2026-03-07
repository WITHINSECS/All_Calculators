import { NextRequest, NextResponse } from "next/server";

import { getBlogPosts } from "@/lib/blog";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") ?? "";
        const limitValue = Number.parseInt(searchParams.get("limit") ?? "", 10);

        const posts = await getBlogPosts({
            search,
            limit: Number.isNaN(limitValue) ? undefined : limitValue,
            publishedOnly: true,
        });

        return NextResponse.json(
            {
                success: true,
                posts,
            },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch blog posts.";
        const status = message.includes("MongoDB connection failed") ? 503 : 500;

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status }
        );
    }
}
