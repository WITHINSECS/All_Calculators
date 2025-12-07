"use client";

import React, { useEffect } from "react";
import { DashbaordSidebar } from "@/components/DashbaordSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const {
        data: session,
        isPending,
        error,
    } = authClient.useSession();


    useEffect(() => {
        if (isPending) return; // still loading

        if (!session) {
            router.push("/login");
            return;
        }

        if (session.user.role !== "admin") {
            router.push("/");
            return;
        }

        router.push("/dashboard/home");
    }, [session, isPending, router]);

    if (isPending || !session || session.user.role !== "admin") {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    // ✅ Only admins, after redirect, will see this layout
    return (
        <SidebarProvider>
            <DashbaordSidebar />
            <main className="w-full">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
