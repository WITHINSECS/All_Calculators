import { NextRequest, NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";

// This route is called automatically by the Vercel Blob client helper.
// It returns a signed upload token/URL so the browser can upload directly.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const jsonResponse = await handleUpload({
            body,
            request: req,
            onBeforeGenerateToken: async (pathname) => {
                // ✅ Optional: restrict uploads to a folder
                // pathname will be something like: "my-image.png"
                return {
                    allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
                    tokenPayload: JSON.stringify({
                        folder: "blog-images",
                        pathname,
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // ✅ This runs after upload finishes (server-side)
                // You can log or store in DB if you want.
                // tokenPayload contains whatever you set above.
                console.log("Upload completed:", blob.url, tokenPayload);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error?.message || "Upload failed" },
            { status: 400 }
        );
    }
}
