"use client";

import {
    BadgeDollarSign,
    Calculator,
    FilePenLine,
    Home,
    LayoutDashboard,
    Mail,
    Newspaper,
} from "lucide-react";
import Link from "next/link";

import DashboardLogoutButton from "@/components/DashboardLogoutButton";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    {
        title: "Home",
        url: "home",
        icon: LayoutDashboard,
    },
    {
        title: "Inquiries",
        url: "inquiries",
        icon: Mail,
    },
    {
        title: "Calculators",
        url: "calculators",
        icon: Calculator,
    },
    {
        title: "AdSense",
        url: "adsense",
        icon: BadgeDollarSign,
    },
    {
        title: "Create Blog",
        url: "blog",
        icon: FilePenLine,
    },
    {
        title: "All Blogs",
        url: "allblogs",
        icon: Newspaper,
    },
];

export function DashbaordSidebar() {
    return (
        <Sidebar>
            <SidebarContent className="flex h-full flex-col">
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`/dashboard/${item.url}`}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="mt-auto p-2">
                    <div className="space-y-2">
                        <DashboardLogoutButton />
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/">
                                        <Home className="h-4 w-4" />
                                        <span>Back to Site</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
