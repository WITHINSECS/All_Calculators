import { DBconnection } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await DBconnection(); // ensure DB is connected
        const body = await request.json();
        const { firstName, lastName, email, phone, message } = body;

        // Basic validation
        if (!firstName || !lastName || !email || !message) {
            return NextResponse.json(
                {
                    message: "First name, last name, email and message are required",
                    success: false,
                },
                { status: 400 }
            );
        }

        const inquiry = await Inquiry.create({
            firstName,
            lastName,
            email,
            phone,
            message,
        });

        return NextResponse.json(
            {
                message: "Inquiry submitted successfully",
                success: true,
                inquiry,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error("Create inquiry error:", errorMessage);
        const status = errorMessage.includes("MongoDB connection failed") ? 503 : 500;

        return NextResponse.json(
            {
                message: "Something went wrong while submitting inquiry",
                success: false,
                error: errorMessage,
            },
            { status }
        );
    }
}
