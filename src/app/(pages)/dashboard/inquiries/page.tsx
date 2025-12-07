import React from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Mail, Phone, MessageSquare } from "lucide-react"

const submissions = [
    {
        id: 1,
        firstName: "Ali",
        lastName: "Raza",
        email: "ali.raza@example.com",
        phone: "+92 300 0000000",
        details: "Looking for a custom financial calculator for loan comparisons.",
        createdAt: "2024-07-12T10:30:00Z",
        status: "new" as const,
    },
    {
        id: 2,
        firstName: "Fatima",
        lastName: "Khan",
        email: "fatima.khan@example.com",
        phone: "+92 301 1234567",
        details:
            "Need a BMI + calorie intake calculator for a fitness startup landing page.",
        createdAt: "2024-07-13T09:15:00Z",
        status: "in-progress" as const,
    },
    {
        id: 3,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 555 0101 010",
        details:
            "We want multiple currency converters embedded into our ecommerce admin.",
        createdAt: "2024-07-14T16:50:00Z",
        status: "replied" as const,
    },
    {
        id: 4,
        firstName: "Sara",
        lastName: "Ahmed",
        email: "sara.ahmed@example.com",
        phone: "+44 7700 900000",
        details:
            "Interest in percentage / discount calculators for a marketing dashboard.",
        createdAt: "2024-07-15T11:05:00Z",
        status: "new" as const,
    },
]

type SubmissionStatus = "new" | "in-progress" | "replied"

function StatusBadge({ status }: { status: SubmissionStatus }) {
    if (status === "new") {
        return (
            <Badge className="text-xs flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                New
            </Badge>
        )
    }

    if (status === "in-progress") {
        return (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                In progress
            </Badge>
        )
    }

    return (
        <Badge variant="outline" className="text-xs flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Replied
        </Badge>
    )
}

export default function FormSubmissionsPage() {
    const total = submissions.length
    const newCount = submissions.filter((s) => s.status === "new").length
    const repliedCount = submissions.filter((s) => s.status === "replied").length

    return (
        <div className="w-full p-6 flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Form Submissions
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        All inquiries submitted from your “Fill in the form” contact section.
                    </p>
                </div>
                <div className="flex flex-col items-end text-sm gap-1">
                    <span className="flex items-center gap-2">
                        <Badge variant="outline">Total: {total}</Badge>
                        <Badge variant="secondary">New: {newCount}</Badge>
                        {/* <Badge variant="outline">Replied: {repliedCount}</Badge> */}
                    </span>
                </div>
            </div>

            {/* Submissions table */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">All inquiries</CardTitle>
                        <CardDescription>
                            Track who contacted you, how, and what they need.
                        </CardDescription>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {total} total messages
                    </span>
                </CardHeader>

                <CardContent>
                    <ScrollArea className="h-[430px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Details</TableHead>
                                    {/* <TableHead>Status</TableHead> */}
                                    <TableHead className="text-right">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        {/* Contact info */}
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium">
                                                    {submission.firstName} {submission.lastName}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {submission.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {submission.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Details preview */}
                                        <TableCell className="align-top">
                                            <p className="text-sm max-w-md truncate">
                                                {submission.details}
                                            </p>
                                        </TableCell>

                                        {/* Status */}
                                        {/* <TableCell className="align-top">
                                            <StatusBadge status={submission.status} />
                                        </TableCell> */}

                                        {/* Date */}
                                        <TableCell className="align-top text-right text-xs text-muted-foreground">
                                            {new Date(submission.createdAt).toLocaleString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
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
