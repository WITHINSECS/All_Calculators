import { NextResponse } from "next/server";
import AuthUser from "@/models/AuthUser";
import Inquiry from "@/models/Inquiry";
import { DBconnection } from "@/lib/db";

interface StatsResponse {
    success: boolean;
    totalUsers: number;
    totalInquiries: number;
    message?: string;
}

export async function GET() {
    await DBconnection();

    try {
        const [totalUsers, totalInquiries] = await Promise.all([
            AuthUser.countDocuments().exec(),
            Inquiry.countDocuments().exec(),
        ]);

        const data: StatsResponse = {
            success: true,
            totalUsers,
            totalInquiries,
        };

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching dashboard stats:", error);

        const data: StatsResponse = {
            success: false,
            totalUsers: 0,
            totalInquiries: 0,
            message:
                error instanceof Error ? error.message : "Unknown error fetching stats",
        };

        return NextResponse.json(data, { status: 500 });
    }
}
