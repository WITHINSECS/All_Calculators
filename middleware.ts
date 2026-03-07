import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";

function buildLoginRedirect(request: NextRequest) {
    const loginUrl = new URL("/login", request.url);
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isAdminApiRoute = pathname.startsWith("/api/admin");
    const isLoginRoute = pathname === "/login";

    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);

    if ((isDashboardRoute || isAdminApiRoute) && !session) {
        if (isAdminApiRoute) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized.",
                },
                { status: 401 }
            );
        }

        return buildLoginRedirect(request);
    }

    if (isLoginRoute && session) {
        return NextResponse.redirect(new URL("/dashboard/home", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/admin/:path*", "/login"],
};
