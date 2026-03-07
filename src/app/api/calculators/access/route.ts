import { NextRequest, NextResponse } from "next/server";

import { getCalculatorVisibility } from "@/lib/calculator-visibility";
import { normalizeCalculatorSlug } from "@/lib/calculator-catalog";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = normalizeCalculatorSlug(searchParams.get("slug") ?? "");

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A calculator slug is required.",
                },
                { status: 400 }
            );
        }

        const visibility = await getCalculatorVisibility(slug);

        return NextResponse.json(
            {
                success: true,
                ...visibility,
            },
            { status: 200 }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to verify calculator access.";
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
