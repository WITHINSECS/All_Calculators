import { NextResponse, type NextRequest } from "next/server";

import { isKnownCalculatorSlug, normalizeCalculatorSlug } from "@/lib/calculator-catalog";
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
    const isCalculatorDetailRoute = pathname.startsWith("/calculators/");
    const shouldCheckAdminSession = isDashboardRoute || isAdminApiRoute || isLoginRoute;

    const token = shouldCheckAdminSession
        ? request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
        : undefined;
    const session = shouldCheckAdminSession
        ? await verifyAdminSessionToken(token)
        : null;

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

    if (isCalculatorDetailRoute) {
        const slug = normalizeCalculatorSlug(pathname.replace(/^\/calculators/, ""));

        if (slug && isKnownCalculatorSlug(slug)) {
            try {
                const accessUrl = new URL("/api/calculators/access", request.url);
                accessUrl.searchParams.set("slug", slug);

                const accessResponse = await fetch(accessUrl, {
                    cache: "no-store",
                    headers: {
                        "x-middleware-request": "1",
                    },
                });

                if (accessResponse.ok) {
                    const data = (await accessResponse.json()) as {
                        success?: boolean;
                        known?: boolean;
                        enabled?: boolean;
                    };

                    if (data.success && data.known && data.enabled === false) {
                        return NextResponse.redirect(new URL("/calculators", request.url));
                    }
                }
            } catch (error) {
                console.error("Failed to verify calculator visibility in middleware:", error);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/admin/:path*", "/login", "/calculators/:path*"],
};
