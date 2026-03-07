export const ADMIN_SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminSessionPayload = {
    adminId: string;
    email: string;
    name: string;
    role: "admin";
    exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSessionSecret() {
    const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.MONGODB_URI;

    if (!secret) {
        throw new Error("Missing ADMIN_SESSION_SECRET. Add it to your environment.");
    }

    return secret;
}

function bytesToBase64Url(bytes: Uint8Array) {
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function stringToBase64Url(value: string) {
    return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToString(value: string) {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return decoder.decode(bytes);
}

async function signValue(value: string) {
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(getSessionSecret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
    return bytesToBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(payload: Omit<AdminSessionPayload, "exp">) {
    const sessionPayload: AdminSessionPayload = {
        ...payload,
        exp: Date.now() + SESSION_DURATION_MS,
    };

    const encodedPayload = stringToBase64Url(JSON.stringify(sessionPayload));
    const signature = await signValue(encodedPayload);

    return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string | null) {
    if (!token) {
        return null;
    }

    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
        return null;
    }

    const expectedSignature = await signValue(encodedPayload);

    if (signature !== expectedSignature) {
        return null;
    }

    try {
        const payload = JSON.parse(base64UrlToString(encodedPayload)) as AdminSessionPayload;

        if (payload.role !== "admin" || payload.exp <= Date.now()) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export function getAdminSessionCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_DURATION_MS / 1000,
    };
}
