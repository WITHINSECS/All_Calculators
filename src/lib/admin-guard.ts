import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";

export async function getCurrentAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

    return verifyAdminSessionToken(token);
}

export async function requireAdminDashboardSession() {
    const session = await getCurrentAdminSession();

    if (!session) {
        redirect("/login");
    }

    return session;
}

export async function requireAdminApiSession() {
    const session = await getCurrentAdminSession();

    if (!session) {
        return {
            session: null,
            response: NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized.",
                },
                { status: 401 }
            ),
        };
    }

    return {
        session,
        response: null,
    };
}
