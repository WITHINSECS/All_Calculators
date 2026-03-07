import React from "react";

import { requireAdminDashboardSession } from "@/lib/admin-guard";
import { DashbaordSidebar } from "@/components/DashbaordSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdminDashboardSession();

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
