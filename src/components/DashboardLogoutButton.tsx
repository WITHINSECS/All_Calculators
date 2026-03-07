"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardLogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await fetch("/api/auth/admin/logout", {
                method: "POST",
            });
        } finally {
            setLoading(false);
            router.push("/login");
            router.refresh();
        }
    };

    return (
        <Button type="button" variant="outline" className="w-full justify-start" onClick={handleLogout} disabled={loading}>
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="mr-2 h-4 w-4" />
            )}
            Logout
        </Button>
    );
}
