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
                    <CardTitle className="text-xl">Admin Access Only</CardTitle>
                    <CardDescription>
                        The dashboard is protected behind the admin login.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Public users cannot access this area. Admin accounts are verified against
                    the MongoDB `admin_accounts` collection before dashboard pages and admin
                    APIs are allowed.
                </CardContent>
            </Card>
        </div>
    );
}
