import { handleUpload } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import { getBlobToken } from "@/lib/blob";

export const runtime = "nodejs";

const allowedContentTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const body = await request.json();

        const response = await handleUpload({
            body,
            request,
            token: getBlobToken(),
            onBeforeGenerateToken: async (pathname) => {
                if (!pathname.startsWith("blog-images/")) {
                    throw new Error("Uploads must use the blog-images folder.");
                }

                return {
                    allowedContentTypes,
                    addRandomSuffix: false,
                    maximumSizeInBytes: 5 * 1024 * 1024,
                    tokenPayload: JSON.stringify({
                        folder: "blog-images",
                    }),
                };
            },
            onUploadCompleted: async ({ blob }) => {
                console.log("Blog image upload completed:", blob.url);
            },
        });

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Image upload failed.";

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status: 400 }
        );
    }
}
