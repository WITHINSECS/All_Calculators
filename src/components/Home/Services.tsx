import Link from "next/link";
import {
    ArrowRight,
    HeartPlus,
    Landmark,
    Shell,
    SquareRadical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample services data
const services = [
    {
        id: 1,
        title: "Finance",
        description: "Tools and resources to help manage budgets, loans, investments, and financial planning.",
        icon: <Landmark className="h-5 w-5" />,
        link: "#",
    },
    {
        id: 2,
        title: "Health",
        description: "Health-related calculators and tools to support wellness, fitness, and medical tracking.",
        icon: <HeartPlus className="h-5 w-5" />,
        link: "#",
    },
    {
        id: 3,
        title: "Lifestyle",
        description: "Everyday tools designed to simplify lifestyle decisions and enhance daily living.",
        icon: <Shell className="h-5 w-5" />,
        link: "#",
    },
    {
        id: 4,
        title: "Math",
        description: "Comprehensive math calculators for solving equations, conversions, and more.",
        icon: <SquareRadical className="h-5 w-5" />,
        link: "#",
    }
];


export default function Services() {
    return (
        <section className="bg-background">
            <div className="container mx-auto px-4 2xl:max-w-[1400px]">
                {/* Section header */}
                <div className="mb-12 text-center md:mb-16">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        OUR SERVICES
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                        Offering a range of reliable and tailored services to meet your personal or business needs with efficiency and quality.
                    </p>
                </div>

                {/* Services List - Horizontal layout for larger screens, vertical for mobile */}
                <div className="mx-auto max-w-4xl">
                    <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                href={"/calculators"}
                                className="group hover:border-primary/20 hover:bg-muted/50 flex items-center gap-4 rounded-lg border border-transparent p-3 transition-all duration-300"
                            >
                                <div className="bg-primary/10 rounded-full p-3">
                                    <div className="text-primary">{service.icon}</div>
                                </div>
                                <div>
                                    <h3 className="font-medium">{service.title} Calculator</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {service.description}
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <div className="text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors">
                                        <ArrowRight className="h-3.5 w-3.5" />
                                        <span className="sr-only">
                                            Learn more about {service.title}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Button asChild size={"lg"}>
                            <Link href="/calculators" className="inline-flex items-center gap-2">
                                <span>View all Calculators</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section >
    );
}
