"use client"
import React, { useEffect, useState } from 'react'
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from '@/lib/siteConfig'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

const Page = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()

    useEffect(() => {
        if (session) {
            router.push("/calculators");
        }
    }, [session, router]);

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (session) {
        return null; // or show nothing (router will redirect)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Signup failed");
                return;
            }

            toast.success("Signup successful!");
            router.push("/login");
        } catch (err: any) {
            if (err?.digest === "NEXT_REDIRECT") return; // ignore special redirect error
            toast.error(err.message || "Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        {siteConfig.name}
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <form onSubmit={handleSubmit} className={"flex flex-col gap-6"}>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-semibold">Create account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to create a new account
                                </p>
                            </div>
                            <div className="grid gap-5">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input onChange={(e) => setName(e.target.value)} value={name} id="name" type="text" placeholder="John Doe" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="m@example.com" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" type="password" required />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {
                                        loading ? (
                                            <Spinner />
                                        ) : (
                                            "Create account"
                                        )
                                    }
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="underline underline-offset-4">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/calculator.avif"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}

export default Page