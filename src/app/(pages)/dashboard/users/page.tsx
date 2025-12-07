import React from "react"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const users = [
    {
        id: 1,
        name: "Ali Raza",
        email: "ali.raza@example.com",
        joinedAt: "2024-06-10",
        status: "active",
        plan: "Pro",
        calculatorsUsed: 18,
    },
    {
        id: 2,
        name: "Fatima Khan",
        email: "fatima.khan@example.com",
        joinedAt: "2024-06-15",
        status: "active",
        plan: "Free",
        calculatorsUsed: 7,
    },
    {
        id: 3,
        name: "John Doe",
        email: "john.doe@example.com",
        joinedAt: "2024-06-20",
        status: "inactive",
        plan: "Free",
        calculatorsUsed: 2,
    },
    {
        id: 4,
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
        joinedAt: "2024-06-22",
        status: "active",
        plan: "Pro",
        calculatorsUsed: 25,
    },
    {
        id: 5,
        name: "David Lee",
        email: "david.lee@example.com",
        joinedAt: "2024-06-25",
        status: "active",
        plan: "Premium",
        calculatorsUsed: 34,
    },
]

export default function Users() {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "active").length

    return (
        <div className="w-full p-6 flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground">
                        All users who have joined your calculators app.
                    </p>
                </div>
                <div className="flex flex-col items-end text-sm">
                    <span className="flex items-center gap-2">
                        <Badge variant="outline">Total: {totalUsers}</Badge>
                        <Badge variant="secondary">Active: {activeUsers}</Badge>
                    </span>
                </div>
            </div>

            {/* Users list card */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">All users</CardTitle>
                    <CardDescription>
                        Basic overview of each user – status, plan, and activity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[420px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Plan</TableHead>
                                    {/* <TableHead className="text-right">
                                        Calculators used
                                    </TableHead> */}
                                    <TableHead className="text-right">Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        {/* User info */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="" alt={user.name} />
                                                    <AvatarFallback>
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            {user.status === "active" ? (
                                                <Badge className="text-xs flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs flex items-center gap-1"
                                                >
                                                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* Plan */}
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {user.plan}
                                            </Badge>
                                        </TableCell>

                                        {/* Calculators used */}
                                        {/* <TableCell className="text-right text-sm">
                                            {user.calculatorsUsed}
                                        </TableCell> */}

                                        {/* Joined date */}
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {new Date(user.joinedAt).toLocaleDateString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
