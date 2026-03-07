import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-guard";
import Inquiry from "@/models/Inquiry";
import { DBconnection } from "@/lib/db";

type ActivityPoint = {
    period: string;
    inquiries: number;
};

type ActivityApiResponse = {
    success: boolean;
    data: ActivityPoint[];
    message?: string;
};

export async function GET() {
    try {
        const auth = await requireAdminApiSession();

        if (auth.response) {
            return auth.response;
        }

        await DBconnection();

        const months = 6;
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

        const inquiryAgg = await Inquiry.aggregate([
            { $match: { createdAt: { $gte: from } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const inquiriesMap = new Map<string, number>();
        (inquiryAgg as { _id: string; count: number }[]).forEach((row) => {
            inquiriesMap.set(row._id, row.count);
        });

        const data: ActivityPoint[] = [];

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const key = `${year}-${month}`;

            data.push({
                period: key,
                inquiries: inquiriesMap.get(key) ?? 0,
            });
        }

        const response: ActivityApiResponse = {
            success: true,
            data,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error fetching activity";
        console.error("Error fetching activity data:", errorMessage);

        const response: ActivityApiResponse = {
            success: false,
            data: [],
            message: errorMessage,
        };
        const status = response.message?.includes("MongoDB connection failed") ? 503 : 500;

        return NextResponse.json(response, { status });
    }
}
