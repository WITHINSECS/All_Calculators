import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import {
    getAdsensePublisherId,
    getAdsenseSettings,
    getMaskedAdsensePublisherId,
    updateAdsenseSettings,
} from "@/lib/adsense";

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

        const settings = await getAdsenseSettings();
        const publisherId = getAdsensePublisherId();

        return NextResponse.json(
            {
                success: true,
                settings,
                publisherIdConfigured: Boolean(publisherId),
                publisherIdPreview: getMaskedAdsensePublisherId(),
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to load AdSense settings.");
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const body = await request.json();
        const settings = await updateAdsenseSettings(body?.settings);
        const publisherId = getAdsensePublisherId();

        return NextResponse.json(
            {
                success: true,
                settings,
                publisherIdConfigured: Boolean(publisherId),
                publisherIdPreview: getMaskedAdsensePublisherId(),
                message: "AdSense settings updated successfully.",
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to update AdSense settings.");
    }
}
