import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Mail, Phone, MessageSquare } from "lucide-react";
import Inquiry, { IInquiry } from "@/models/Inquiry";
import { DBconnection } from "@/lib/db";


export default async function FormSubmissionsPage() {
    await DBconnection();

    // Fetch all inquiries, newest first
    const submissions: IInquiry[] = await Inquiry.find()
        .sort({ createdAt: -1 })
        .exec();

    const total = submissions.length;

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
                                    <TableHead className="text-right">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((submission) => (
                                    <TableRow key={submission._id.toString()}>
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
                                                {submission.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Phone className="h-3 w-3" />
                                                            {submission.phone}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Details preview */}
                                        <TableCell className="align-top">
                                            <p className="text-sm max-w-md truncate">
                                                {submission.message}
                                            </p>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="align-top text-right text-xs text-muted-foreground">
                                            {submission.createdAt
                                                ? new Date(submission.createdAt).toLocaleString("en-US", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {submissions.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center text-sm text-muted-foreground py-10"
                                        >
                                            No inquiries yet.
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
