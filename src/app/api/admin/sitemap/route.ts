import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import {
    getSitemapDashboardSettings,
    updateSitemapSettings,
} from "@/lib/sitemap-settings";

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

export async function GET() {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const data = await getSitemapDashboardSettings();

        return NextResponse.json(
            {
                success: true,
                ...data,
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to load sitemap settings.");
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const body = await request.json();
        const data = await updateSitemapSettings(body?.settings ?? {});

        revalidatePath("/sitemap.xml");
        revalidatePath("/robots.txt");

        return NextResponse.json(
            {
                success: true,
                ...data,
                message: "Sitemap settings updated successfully.",
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to update sitemap settings.");
    }
}
