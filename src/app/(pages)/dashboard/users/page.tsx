import React from "react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import AuthUser, { IAuthUser } from "@/models/AuthUser";
import { DBconnection } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Users() {
    await DBconnection();

    // get all Better Auth users, newest first
    const users: IAuthUser[] = await AuthUser.find()
        .sort({ createdAt: -1 })
        .exec();

    const totalUsers = users.length;
    // For now, treat all as "active" – you can later derive status from sessions if you want
    const activeUsers = totalUsers;

    return (
        <div className="w-full p-6 flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground">
                        All users who have joined your calculators app (from Better Auth).
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
                        Basic overview of each user – email and join date.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[420px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user,idx) => {
                                    const name = user.name || user.email.split("@")[0];

                                    const initials = name
                                        .split(" ")
                                        .filter(Boolean)
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase();

                                    return (
                                        <TableRow key={idx}>
                                            {/* User info */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.image || ""} alt={name} />
                                                        <AvatarFallback>{initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Status (simple for now) */}
                                            <TableCell>
                                                <Badge className="text-xs flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    Active
                                                </Badge>
                                            </TableCell>

                                            {/* Joined date */}
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "-"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center text-sm text-muted-foreground py-10"
                                        >
                                            No users found yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
