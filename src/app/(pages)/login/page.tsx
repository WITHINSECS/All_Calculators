"use client";

import React, { useEffect, useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/siteConfig";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const Page = () => {
    const router = useRouter();

    // ✅ Declare ALL hooks before any conditional return
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        data: session,
        isPending,
        error,
        refetch,
    } = authClient.useSession();

    // ✅ Side effect for redirect
    useEffect(() => {
        if (session) {
            router.replace("/calculators");
        }
    }, [session, router]);

    // ✅ Handle loading and redirect states safely
    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (session) {
        return null;
    }

    // ✅ Handlers
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(error.message || "Login failed");
                return;
            }

            toast.success("Login successful!");
            router.push("/calculators");
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
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
                        <div className={"flex flex-col gap-6"}>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-semibold">Login to your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to login to your account
                                </p>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        placeholder="••••••••"
                                        id="password"
                                        type="password"
                                        required
                                    />
                                </div>
                                <Button onClick={handleSubmit} type="submit" disabled={loading} className="w-full">
                                    {loading ? <Spinner /> : "Login"}
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <Button onClick={signIn} variant="outline" className="w-full">
                                    {
                                        loading ? (
                                            <Spinner />
                                        ) : (
                                            <>
                                                <FaGoogle />
                                                Login with Google
                                            </>
                                        )
                                    }
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </div>
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
    );
};

export default Page;