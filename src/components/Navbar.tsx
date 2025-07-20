"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { siteConfig } from "@/lib/siteConfig"

const Navbar = () => {
    return (
        <header className="w-full border-b">
            <div className="container lg:px-20 mx-auto flex h-16 items-center justify-between px-4">
                {/* Left: Logo */}
                <Link href="/">
                    <span className="text-lg tracking-wider font-semibold">{siteConfig.name}</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-1">
                    <Link href="/">
                        <Button className="cursor-pointer" variant="ghost">Home</Button>
                    </Link>
                    <Link href="/about">
                        <Button className="cursor-pointer" variant="ghost">About</Button>
                    </Link>
                    <Link href="/pricing">
                        <Button className="cursor-pointer" variant="ghost">Pricing</Button>
                    </Link>
                    <Link href="/calculators">
                        <Button className="cursor-pointer" variant="ghost">Calculators</Button>
                    </Link>
                    <Link href="/blog">
                        <Button className="cursor-pointer" variant="ghost">Blog</Button>
                    </Link>
                    <Link href="/contact">
                        <Button className="cursor-pointer" variant="ghost">Contact</Button>
                    </Link>
                </nav>

                <div className="md:flex hidden items-center gap-2">
                    <Link href={"/signup"}>
                        <Button className="cursor-pointer">
                            Sign up
                        </Button>
                    </Link>
                    <Link href={"/login"}>
                        <Button className="cursor-pointer" variant={"outline"}>
                            Login
                        </Button>
                    </Link>
                </div>

                {/* Mobile Nav (Sheet Menu) */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Menu className="" size={24} />
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>{siteConfig.name}</SheetTitle>
                                <SheetDescription>
                                    Navigate through the site using the menu below.
                                </SheetDescription>
                            </SheetHeader>
                            <nav className="flex flex-col p-4 gap-4 ">
                                <Link href="/">
                                    <Button variant="ghost" className="w-full justify-start">Home</Button>
                                </Link>
                                <Link href="/about">
                                    <Button variant="ghost" className="w-full justify-start">About</Button>
                                </Link>
                                <Link href="/calculators">
                                    <Button variant="ghost" className="w-full justify-start">Calculators</Button>
                                </Link>
                                <Link href="/pricing">
                                    <Button variant="ghost" className="w-full justify-start">Pricing</Button>
                                </Link>
                                <Link href="/blog">
                                    <Button variant="ghost" className="w-full justify-start">Blog</Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="ghost" className="w-full justify-start">Contact</Button>
                                </Link>
                                <Link href={"/signup"}>
                                    <Button className="cursor-pointer w-full">
                                        Sign up
                                    </Button>
                                </Link>
                                <Link href={"/login"}>
                                    <Button className="cursor-pointer w-full" variant={"outline"}>
                                        Login
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

export default Navbar