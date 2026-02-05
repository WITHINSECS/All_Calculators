"use client"
import Wrapper from '@/app/Wrapper'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { evaluate } from "mathjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
// import PricingSectionCards from '@/components/Home/PricingSectionCards'
import Services from '@/components/Home/Services'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import BlogSectionSlider from '@/components/BlogSectionSlider'
import { siteConfig } from '@/lib/siteConfig'
import AdsenseAd from '@/components/AdsenseAd'
import { ADSENSE_SLOTS } from '@/config/adsense'

const sciButtons = [
    ["sin", "cos", "tan", "Deg", "Rad"],
    ["asin", "acos", "atan", "π", "e"],
    ["^", "x³", "x²", "exp", "10^"],
    ["√", "cbrt", "nthRoot", "ln", "log"],
    ["(", ")", "1/x", "%", "!"],
]

const numButtons = [
    ["7", "8", "9", "+", "Back"],
    ["4", "5", "6", "-", "Ans"],
    ["1", "2", "3", "*", "M+"],
    ["0", ".", "EXP", "/", "M-"],
    ["±", "RND", "AC", "=", "MR"],
]

const Page = () => {
    const [display, setDisplay] = useState("0")
    const [memory, setMemory] = useState(0)
    const [angleMode, setAngleMode] = useState("Deg")
    const [lastAnswer, setLastAnswer] = useState("")

    const appendToDisplay = (value: string) => {
        if (display === "0" || display === "Error") {
            setDisplay(value)
        } else {
            setDisplay(display + value)
        }
    }

    const handleSciClick = (label: string) => {
        switch (label) {
            case "π":
                appendToDisplay("3.14159265359")
                break
            case "e":
                appendToDisplay("2.71828182846")
                break
            case "x²":
                appendToDisplay("^2")
                break
            case "x³":
                appendToDisplay("^3")
                break
            case "10^":
                appendToDisplay("10^")
                break
            case "exp":
                appendToDisplay("exp(")
                break
            case "√":
                appendToDisplay("sqrt(")
                break
            case "cbrt":
                appendToDisplay("cbrt(")
                break
            case "nthRoot":
                appendToDisplay("nthRoot(")
                break
            case "ln":
                appendToDisplay("log(")
                break
            case "log":
                appendToDisplay("log10(")
                break
            case "1/x":
                appendToDisplay("1/(")
                break
            case "%":
                appendToDisplay("%")
                break
            case "!":
                appendToDisplay("!")
                break
            case "sin": case "cos": case "tan":
            case "asin": case "acos": case "atan":
                appendToDisplay(`${label}(`)
                break
            case "Deg":
            case "Rad":
                setAngleMode(label)
                break
            default:
                appendToDisplay(label)
        }
    }

    const handleNumClick = (label: string) => {
        switch (label) {
            case "Back":
                setDisplay(display.slice(0, -1) || "0")
                break
            case "Ans":
                appendToDisplay(lastAnswer)
                break
            case "AC":
                setDisplay("0")
                break
            case "=":
                try {
                    const result = evaluate(display)
                    setLastAnswer(result.toString())
                    setDisplay(result.toString())
                } catch {
                    setDisplay("Error")
                }
                break
            case "±":
                if (display.startsWith("-")) {
                    setDisplay(display.slice(1))
                } else {
                    setDisplay("-" + display)
                }
                break
            case "RND":
                setDisplay(Math.random().toString())
                break
            case "M+":
                setMemory(memory + parseFloat(display))
                break
            case "M-":
                setMemory(memory - parseFloat(display))
                break
            case "MR":
                setDisplay(memory.toString())
                break
            default:
                appendToDisplay(label)
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key

            // Allow digits, operators and Enter
            if (/^[0-9+\-*/().%]$/.test(key)) {
                appendToDisplay(key)
            } else if (key === "Enter") {
                handleNumClick("=")
            } else if (key === "Backspace") {
                handleNumClick("Back")
            } else if (key === "Escape") {
                handleNumClick("AC")
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [display])


    return (
        <Wrapper className='mt-5'>

            <div className='flex max-w-7xl items-center lg:flex-row flex-col lg:gap-5 gap-10 justify-between w-full mx-auto p-5'>
                <div className="lg:max-w-[50%] w-full lg:p-4">
                    {/* Announcement Banner */}
                    <div className="flex justify-center lg:justify-start">
                        <div
                            className="inline-flex items-center gap-x-2 rounded-full border p-1 ps-3 text-sm transition"
                        >
                            Welcome to {siteConfig.name}
                            <span className="bg-muted-foreground/15 inline-flex items-center justify-center gap-x-2 rounded-full px-2.5 py-1.5 text-sm font-semibold">
                                <svg
                                    className="h-4 w-4 flex-shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 max-w-2xl lg:mx-0 lg:text-start text-center mx-auto">
                        <h1 className="scroll-m-20 text-4xl font-bold lg:text-5xl">
                            Best Calculators
                        </h1>
                    </div>
                    {/* End Title */}
                    <div className="mt-5 max-w-3xl lg:mx-0 lg:text-start text-center mx-auto">
                        <p className="text-muted-foreground text-lg">
                            Calculators help you perform math operations quickly and accurately.
                            From basic to scientific, choose the right one for your needs.
                        </p>
                    </div>
                    {/* Buttons */}
                    <div className="mt-8 flex gap-3 lg:justify-start justify-center">
                        <Link href={"/calculators"}>
                            <Button size={"lg"}>Get started</Button>
                        </Link>
                        <Link href={"/about"}>
                            <Button size={"lg"} variant={"outline"}>
                                Learn more
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-6">
                        <div className="w-full mx-auto">
                            <div className="relative">
                                {/* Background cards for stacked effect */}
                                <div className="absolute -bottom-2 -right-2 w-full h-full  rounded-lg border"></div>
                                <div className="absolute -bottom-1 -right-1 w-full h-full  rounded-lg border"></div>

                                {/* Main card */}
                                <Card className="relative">
                                    <CardHeader>
                                        <CardTitle>Top Calculators</CardTitle>
                                        <CardDescription>
                                            Top-performing calculators for all your calculation needs.
                                        </CardDescription>

                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Discover a selection of high-quality calculators designed to meet a variety of mathematical and professional needs.
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Link href={"/calculators"}>
                                            <Button>Explore</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="lg:p-4 lg:max-w-[50%] w-full space-y-4">
                    <div className="bg-muted text-right text-2xl font-mono p-4 rounded border overflow-x-hidden break-words">
                        {display}
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {sciButtons.flat().map((label, idx) => (
                            <Button key={idx} variant="outline" onClick={() => handleSciClick(label)}>
                                {label}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {numButtons.flat().map((label, idx) => (
                            <Button
                                key={idx}
                                variant={["=", "AC"].includes(label) ? "default" : "secondary"}
                                onClick={() => handleNumClick(label)}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <AdsenseAd slot={ADSENSE_SLOTS.homeTop} />


            <div className="md:mt-20 mt-10">
                <Services />
            </div>

            <div className="container mx-auto md:mt-20 mt-10">
                <div className="max-w-5xl px-4 mx-auto">
                    <div className="border rounded-xl">
                        <div className="p-4 lg:p-8 rounded-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-y-20 gap-x-12">
                                {/* Stats */}
                                <div className="relative text-center first:before:hidden before:absolute before:-top-full sm:before:top-1/2 before:start-1/2 sm:before:-start-6 before:w-px before:h-20 before:bg-border before:rotate-[60deg] sm:before:rotate-12 before:transform sm:before:-translate-y-1/2 before:-translate-x-1/2 sm:before:-translate-x-0 before:mt-3.5 sm:before:mt-0">
                                    <svg
                                        className="shrink-0 size-6 sm:size-8  mx-auto"
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
                                        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                                        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                                        <path d="m21 3 1 11h-2" />
                                        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                                        <path d="M3 4h8" />
                                    </svg>
                                    <div className="mt-3 sm:mt-5">
                                        <h3 className="text-lg sm:text-3xl font-semibold">
                                            1,000+
                                        </h3>
                                        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                                            partners
                                        </p>
                                    </div>
                                </div>
                                {/* End Stats */}

                                {/* Stats */}
                                <div className="relative text-center first:before:hidden before:absolute before:-top-full sm:before:top-1/2 before:start-1/2 sm:before:-start-6 before:w-px before:h-20 before:bg-border before:rotate-[60deg] sm:before:rotate-12 before:transform sm:before:-translate-y-1/2 before:-translate-x-1/2 sm:before:-translate-x-0 before:mt-3.5 sm:before:mt-0">
                                    <div className="flex justify-center items-center -space-x-5">
                                        <Avatar className="relative z-[2] shrink-0 size-8 border-primary border">
                                            <AvatarImage src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"></AvatarImage>
                                        </Avatar>
                                        <Avatar className="relative z-[1] shrink-0 size-8 border-primary border -mt-7">
                                            <AvatarImage src="https://images.unsplash.com/photo-1570654639102-bdd95efeca7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"></AvatarImage>
                                        </Avatar>{" "}
                                        <Avatar className="relative shrink-0 size-8 border-primary border">
                                            <AvatarImage src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"></AvatarImage>
                                        </Avatar>
                                    </div>
                                    <div className="mt-3 sm:mt-5">
                                        <h3 className="text-lg sm:text-3xl font-semibold">95%</h3>
                                        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                                            Happy customers
                                        </p>
                                    </div>
                                </div>
                                {/* End Stats */}

                                {/* Stats */}
                                <div className="relative text-center first:before:hidden before:absolute before:-top-full sm:before:top-1/2 before:start-1/2 sm:before:-start-6 before:w-px before:h-20 before:bg-border before:rotate-[60deg] sm:before:rotate-12 before:transform sm:before:-translate-y-1/2 before:-translate-x-1/2 sm:before:-translate-x-0 before:mt-3.5 sm:before:mt-0">
                                    <svg
                                        className="shrink-0 size-6 sm:size-8 mx-auto"
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
                                        <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                                        <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                                        <path d="m2 16 6 6" />
                                        <circle cx="16" cy="9" r="2.9" />
                                        <circle cx="6" cy="5" r="3" />
                                    </svg>
                                    <div className="mt-3 sm:mt-5">
                                        <h3 className="text-lg sm:text-3xl font-semibold">98%</h3>
                                        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                                            Client Satisfaction
                                        </p>
                                    </div>
                                </div>
                                {/* End Stats */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="md:mt-20 mt-10">
                <PricingSectionCards />
            </div> */}


            <div className="md:mt-20 mt-10">
                <BlogSectionSlider />
            </div>

            <AdsenseAd slot={ADSENSE_SLOTS.homeBottom} />


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
                        <Link href="/calculators">
                            See All
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </Wrapper>
    )
}

export default Page