import Wrapper from "@/app/Wrapper";

export default function CalculatorsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <Wrapper>{children}</Wrapper>;
}
