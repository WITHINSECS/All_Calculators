"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, BrainCircuit, MessageSquare, Wrench } from "lucide-react";
import Link from "next/link";
import Wrapper from '@/app/Wrapper'
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";


const page = () => {

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.firstName || !form.lastName || !form.email || !form.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setSubmitting(true);

            const res = await fetch("/api/inquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message ?? "Failed to send inquiry.");
                return;
            }

            toast.success("Inquiry sent successfully!");
            // reset form
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                message: "",
            });
        } catch (err) {
            console.error("Inquiry submit error:", err);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <Wrapper>
            <div className="max-w-7xl lg:px-12 mx-auto mb-10 px-4 md:px-6 md:mt-16 mt-8">
                {/* Title */}
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-semibold sm:text-4xl">Contact us</h1>
                    <p className="text-muted-foreground mt-3">
                        We&apos;d love to talk about how we can help you.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-4xl">
                    <Card className="p-0">
                        <CardContent className="p-6">
                            <h2 className="mb-8 text-xl font-semibold">Fill in the form</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 lg:gap-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                                        <div>
                                            <Label htmlFor="firstname" className="mb-2">
                                                First Name
                                            </Label>
                                            <Input
                                                type="text"
                                                id="firstname"
                                                name="firstName"
                                                placeholder="Enter your first name"
                                                value={form.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastname" className="mb-2">
                                                Last Name
                                            </Label>
                                            <Input
                                                type="text"
                                                id="lastname"
                                                name="lastName"
                                                placeholder="Enter your last name"
                                                value={form.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                                        <div>
                                            <Label htmlFor="email" className="mb-2">
                                                Email
                                            </Label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="mb-2">
                                                Phone Number
                                            </Label>
                                            <Input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                placeholder="Enter your phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="message" className="mb-2">
                                            Details
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us about your project"
                                            rows={4}
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 grid">
                                    <Button type="submit" size="lg" disabled={submitting}>
                                        {submitting ? "Sending..." : "Send inquiry"}
                                    </Button>
                                </div>

                                <div className="mt-3 text-center">
                                    <p className="text-muted-foreground text-sm">
                                        We&apos;ll get back to you in 1-2 business days.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 grid items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    <Link
                        href={"/contact"}
                        className="group hover:bg-muted flex h-full flex-col rounded-lg p-4 text-center sm:p-6"
                    >
                        <BrainCircuit className="text-muted-foreground mx-auto size-9" />
                        <div className="mt-5">
                            <h3 className="text-lg font-semibold">Knowledgebase</h3>
                            <p className="text-muted-foreground mt-1">
                                We&apos;re here to help with any questions or code.
                            </p>
                            <p className="text-primary mt-5 inline-flex items-center gap-x-1 font-medium">
                                Contact support
                                <svg
                                    className="size-4 transition ease-in-out group-hover:translate-x-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={"#"}
                        className="group hover:bg-muted flex h-full flex-col rounded-lg p-4 text-center sm:p-6"
                    >
                        <MessageSquare className="text-muted-foreground mx-auto size-9" />
                        <div className="mt-5">
                            <h3 className="text-lg font-semibold">FAQ</h3>
                            <p className="text-muted-foreground mt-1">
                                Search our FAQ for answers to anything you might ask.
                            </p>
                            <p className="text-primary mt-5 inline-flex items-center gap-x-1 font-medium">
                                Visit FAQ
                                <svg
                                    className="size-4 transition ease-in-out group-hover:translate-x-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={"#"}
                        className="group hover:bg-muted flex h-full flex-col rounded-lg p-4 text-center sm:p-6"
                    >
                        <Wrench className="text-muted-foreground mx-auto size-9" />
                        <div className="mt-5">
                            <h3 className="text-lg font-semibold">Calculators</h3>
                            <p className="text-muted-foreground mt-1">
                                Check out our top calculators as per your need.
                            </p>
                            <p className="text-primary mt-5 inline-flex items-center gap-x-1 font-medium">
                                Check Out
                                <svg
                                    className="size-4 transition ease-in-out group-hover:translate-x-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="bg-primary md:mt-20 mt-10 w-full py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-primary-foreground text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Top-Rated Calculators
                    </h2>

                    <p className="text-primary-foreground/90 mx-auto mt-3 max-w-2xl text-lg">
                        Discover our top calculators—designed to meet your needs, provide exceptional accuracy, and assist you in every calculation
                    </p>

                    <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="group mt-8 font-medium"
                    >
                        <Link href="#">
                            See All
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Wrapper>
    )
}

export default page