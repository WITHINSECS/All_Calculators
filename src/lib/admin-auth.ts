import "server-only";

import { pbkdf2Sync, scryptSync, timingSafeEqual } from "node:crypto";

import { DBconnection } from "@/lib/db";
import AdminAccount from "@/models/AdminAccount";

export type AuthenticatedAdmin = {
    id: string;
    name: string;
    email: string;
    role: "admin";
};

function compareHex(expected: string, actual: string) {
    try {
        const expectedBuffer = Buffer.from(expected, "hex");
        const actualBuffer = Buffer.from(actual, "hex");

        if (expectedBuffer.length !== actualBuffer.length) {
            return false;
        }

        return timingSafeEqual(expectedBuffer, actualBuffer);
    } catch {
        return false;
    }
}

function verifySaltedHash(password: string, storedPasswordHash: string) {
    const [salt, expectedHash] = storedPasswordHash.split(":");

    if (!salt || !expectedHash) {
        return false;
    }

    const keyLength = expectedHash.length / 2;

    if (!Number.isInteger(keyLength) || keyLength <= 0) {
        return false;
    }

    const scryptCandidate = scryptSync(password, salt, keyLength).toString("hex");

    if (compareHex(expectedHash, scryptCandidate)) {
        return true;
    }

    const pbkdf2Candidate = pbkdf2Sync(password, salt, 100000, keyLength, "sha512").toString("hex");
    return compareHex(expectedHash, pbkdf2Candidate);
}

export async function authenticateAdmin(email: string, password: string) {
    await DBconnection();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
        return null;
    }

    const admin = await AdminAccount.findOne({
        email: normalizedEmail,
        role: "admin",
    }).lean();

    if (!admin || !verifySaltedHash(password, admin.passwordHash ?? "")) {
        return null;
    }

    return {
        id: admin._id?.toString?.() ?? "",
        name: admin.name ?? "Admin",
        email: admin.email,
        role: "admin" as const,
    } satisfies AuthenticatedAdmin;
}
