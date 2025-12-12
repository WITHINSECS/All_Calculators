"use client"

import { Home, Mail, Users, LogOut, Upload, Images } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

const items = [
    {
        title: "Home",
        url: "home",
        icon: Home,
    },
    {
        title: "Users",
        url: "users",
        icon: Users,
    },
    {
        title: "Inquiries",
        url: "inquiries",
        icon: Mail,
    },
    {
        title: "Blog",
        url: "blog",
        icon: Upload,
    },
    {
        title: "All Blog",
        url: "allblogs",
        icon: Images,
    },
]

export function DashbaordSidebar() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await authClient.signOut()       
            router.push("/login")            
        } catch (err) {
            console.error("Error logging out:", err)
        }
    }

    return (
        <Sidebar>
            {/* make content a flex column so we can push logout to bottom */}
            <SidebarContent className="flex h-full flex-col">
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
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

                {/* 🔻 Logout at the bottom */}
                <div className="mt-auto p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Button
                                    variant="destructive"
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 hover:bg-red-300 transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </Button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
