import AdminLoginForm from "@/components/AdminLoginForm";

function getSafeNextPath(value?: string) {
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
        return "/dashboard/home";
    }

    return value;
}

export default async function LoginPage(props: {
    searchParams: Promise<{ next?: string }>;
}) {
    const searchParams = await props.searchParams;
    const nextPath = getSafeNextPath(searchParams.next);

    return <AdminLoginForm nextPath={nextPath} />;
}
