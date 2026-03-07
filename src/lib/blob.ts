import { del } from "@vercel/blob";

function readBlobToken() {
    return process.env.BLOB_READ_WRITE_TOKEN ?? process.env.NEW_READ_WRITE_TOKEN ?? "";
}

export function getBlobToken() {
    const token = readBlobToken();

    if (!token) {
        throw new Error(
            "Missing Vercel Blob read/write token. Set BLOB_READ_WRITE_TOKEN or NEW_READ_WRITE_TOKEN."
        );
    }

    return token;
}

export function isManagedBlobUrl(url: string) {
    if (!url) {
        return false;
    }

    try {
        const parsed = new URL(url);
        return parsed.hostname.endsWith(".public.blob.vercel-storage.com");
    } catch {
        return false;
    }
}

export async function deleteManagedBlob(url: string) {
    if (!isManagedBlobUrl(url)) {
        return;
    }

    const token = readBlobToken();

    if (!token) {
        return;
    }

    await del(url, { token });
}
