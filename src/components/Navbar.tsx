"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
    return (
        <header className="w-full border-b">
            <div className="container lg:px-20 mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        width={500}
                        height={500}
                        alt="logo"
                        className="w-full md:h-14 h-10"
                    />
                </Link>

                <nav className="hidden md:flex gap-1">
                    <Link href="/">
                        <Button className="cursor-pointer" variant="ghost">
                            Home
                        </Button>
                    </Link>
                    <Link href="/about">
                        <Button className="cursor-pointer" variant="ghost">
                            About
                        </Button>
                    </Link>
                    <Link href="/calculators">
                        <Button className="cursor-pointer" variant="ghost">
                            Calculators
                        </Button>
                    </Link>
                    <Link href="/blog">
                        <Button className="cursor-pointer" variant="ghost">
                            Blog
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button className="cursor-pointer" variant="ghost">
                            Contact
                        </Button>
                    </Link>
                </nav>

                <div className="md:flex hidden items-center gap-2">
                    <Link href="/calculators">
                        <Button className="cursor-pointer" variant="outline">
                            Explore
                        </Button>
                    </Link>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Menu size={24} />
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <Image
                                    src="/logo.png"
                                    width={100}
                                    height={100}
                                    alt="logo"
                                    className="w-40 h-8"
                                />
                                <SheetDescription>
                                    Navigate through the site using the menu below.
                                </SheetDescription>
                            </SheetHeader>
                            <nav className="flex flex-col p-4 gap-4">
                                <Link href="/">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/about">
                                    <Button variant="ghost" className="w-full justify-start">
                                        About
                                    </Button>
                                </Link>
                                <Link href="/calculators">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Calculators
                                    </Button>
                                </Link>
                                <Link href="/blog">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Blog
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Contact
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
