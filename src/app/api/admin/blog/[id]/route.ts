import { NextRequest, NextResponse } from "next/server";
import { DBconnection } from "@/lib/db";
import BlogPost from "@/models/blog";
import mongoose from "mongoose";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await DBconnection();

    try {
        // ✅ Next 15 fix: await params
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Blog ID is required" },
                { status: 400 }
            );
        }

        // ✅ Validate ObjectId to avoid 400/500 confusion
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Blog ID" },
                { status: 400 }
            );
        }

        const deleted = await BlogPost.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Blog deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Failed to delete blog", error: error?.message },
            { status: 500 }
        );
    }
}
