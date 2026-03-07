import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import Inquiry from "@/models/Inquiry";
import BlogPost from "@/models/blog";
import { DBconnection } from "@/lib/db";

interface StatsResponse {
    success: boolean;
    totalInquiries: number;
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    message?: string;
}

export async function GET() {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        await DBconnection();

        const [totalInquiries, totalBlogs, publishedBlogs] = await Promise.all([
            Inquiry.countDocuments().exec(),
            BlogPost.countDocuments().exec(),
            BlogPost.countDocuments({ isPublished: true }).exec(),
        ]);

        const data: StatsResponse = {
            success: true,
            totalInquiries,
            totalBlogs,
            publishedBlogs,
            draftBlogs: totalBlogs - publishedBlogs,
        };

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error fetching stats";
        console.error("Error fetching dashboard stats:", errorMessage);

        const data: StatsResponse = {
            success: false,
            totalInquiries: 0,
            totalBlogs: 0,
            publishedBlogs: 0,
            draftBlogs: 0,
            message: errorMessage,
        };
        const status = data.message?.includes("MongoDB connection failed") ? 503 : 500;

        return NextResponse.json(data, { status });
    }
}
