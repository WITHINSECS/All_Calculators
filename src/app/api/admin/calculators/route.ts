import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import {
    buildCalculatorVisibilitySummary,
    getManagedCalculators,
    setCalculatorEnabled,
} from "@/lib/calculator-visibility";

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

        const items = await getManagedCalculators();
        const summary = buildCalculatorVisibilitySummary(items);

        return NextResponse.json(
            {
                success: true,
                items,
                summary,
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to load calculator settings.");
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const body = await request.json();
        const slug = String(body.slug ?? "");
        const enabled = body.enabled;

        if (typeof enabled !== "boolean") {
            return NextResponse.json(
                {
                    success: false,
                    message: "A boolean enabled value is required.",
                },
                { status: 400 }
            );
        }

        const update = await setCalculatorEnabled(slug, enabled);
        const summary = buildCalculatorVisibilitySummary(update.items);

        return NextResponse.json(
            {
                success: true,
                item: update.item,
                summary,
                message: enabled
                    ? "Calculator enabled successfully."
                    : "Calculator disabled successfully.",
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to update calculator visibility.");
    }
}
