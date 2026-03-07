import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE_NAME, getAdminSessionCookieOptions } from "@/lib/admin-session";

export async function POST() {
    const response = NextResponse.json(
        {
            success: true,
            message: "Logged out successfully.",
        },
        { status: 200 }
    );

    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
        ...getAdminSessionCookieOptions(),
        maxAge: 0,
    });

    return response;
}
