import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/admin-auth";
import {
    ADMIN_SESSION_COOKIE_NAME,
    createAdminSessionToken,
    getAdminSessionCookieOptions,
} from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body.email ?? "").trim();
        const password = String(body.password ?? "");

        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email and password are required.",
                },
                { status: 400 }
            );
        }

        const admin = await authenticateAdmin(email, password);

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid admin credentials.",
                },
                { status: 401 }
            );
        }

        const token = await createAdminSessionToken({
            adminId: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        });
        const response = NextResponse.json(
            {
                success: true,
                message: "Admin login successful.",
            },
            { status: 200 }
        );

        response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, getAdminSessionCookieOptions());

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed.";
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
