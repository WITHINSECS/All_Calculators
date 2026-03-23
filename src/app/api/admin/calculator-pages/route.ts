import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminApiSession } from "@/lib/admin-guard";
import {
    getManagedCalculatorPageContentItems,
    updateCalculatorPageContent,
} from "@/lib/calculator-page-content";

export const runtime = "nodejs";

function getErrorResponse(error: unknown, fallbackMessage: string) {
    const message = error instanceof Error ? error.message : fallbackMessage;
    const status =
        message.includes("MongoDB connection failed")
            ? 503
            : message.includes("Unknown calculator page.")
              ? 400
              : 500;

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

        const items = await getManagedCalculatorPageContentItems();

        return NextResponse.json(
            {
                success: true,
                items,
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to load calculator page content.");
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        const body = await request.json();
        const slug = String(body?.slug ?? "");

        const item = await updateCalculatorPageContent(slug, {
            cardTitle: body?.cardTitle,
            cardSubTitle: body?.cardSubTitle,
            cardDescription: body?.cardDescription,
            pageHeading: body?.pageHeading,
            pageIntro: body?.pageIntro,
            seoTitle: body?.seoTitle,
            seoDescription: body?.seoDescription,
            contentTitle: body?.contentTitle,
            contentIntro: body?.contentIntro,
            contentHtml: body?.contentHtml,
            faqItems: body?.faqItems,
        });

        revalidateTag("calculator-page-content", "max");
        revalidatePath(item.path);

        if (item.path !== "/calculators") {
            revalidatePath("/calculators");
        }

        return NextResponse.json(
            {
                success: true,
                item,
                message: "Calculator page content updated successfully.",
            },
            { status: 200 }
        );
    } catch (error) {
        return getErrorResponse(error, "Failed to update calculator page content.");
    }
}






