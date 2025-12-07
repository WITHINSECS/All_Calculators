"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

type UserWithRole = {
    role?: string;
};

const Page = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { data, isPending, error } = authClient.useSession();

    // 🔹 derive role safely without `any`
    const sessionUser = data?.user as unknown as UserWithRole | undefined;
    const sessionRole = sessionUser?.role;

    // 🔁 Redirect if already logged in
    useEffect(() => {
        if (isPending || !data?.user) return;

        if (sessionRole === "admin") {
            router.replace("/dashboard/home");
        } else {
            router.replace("/calculators");
        }
    }, [data, isPending, sessionRole, router]);

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (data?.user) {
        // already logged in, redirecting above
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

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

            const loginUser = data?.user as unknown as UserWithRole | undefined;
            const role = loginUser?.role;

            toast.success("Login successful!");

            if (role === "admin") {
                router.push("/dashboard/home");
            } else {
                router.push("/calculators");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    console.log("SESSION FROM BETTER AUTH:", data);

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <Image
                            src={"/logo.png"}
                            width={500}
                            height={500}
                            alt="image"
                            className="w-full md:h-14 h-10"
                        />
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <div className="flex flex-col gap-6">
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
                                <Button
                                    onClick={handleSubmit}
                                    type="button"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? <Spinner /> : "Login"}
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
