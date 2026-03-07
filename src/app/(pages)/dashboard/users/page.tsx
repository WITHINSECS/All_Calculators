import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function UsersPage() {
    return (
        <div className="w-full p-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Users Removed</CardTitle>
                    <CardDescription>
                        Better Auth has been removed from this project.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    User accounts, roles, and admin authentication are no longer part of the
                    application. The dashboard is now open access.
                </CardContent>
            </Card>
        </div>
    );
}
