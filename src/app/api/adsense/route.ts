import { NextResponse } from "next/server";

import { getAdsensePublisherId, getAdsenseSettingsSafe } from "@/lib/adsense";

export const runtime = "nodejs";

export async function GET() {
    const settings = await getAdsenseSettingsSafe();

    return NextResponse.json(
        {
            success: true,
            settings,
            publisherIdConfigured: Boolean(getAdsensePublisherId()),
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}
