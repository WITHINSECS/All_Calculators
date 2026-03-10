"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdsenseAd from "@/components/AdsenseAd";

interface WrapperProps {
    children: React.ReactNode;
    className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
    const pathname = usePathname();
    const isCalculatorRoute =
        pathname === "/calculators" || pathname?.startsWith("/calculators/");
    const isBlogPostRoute = pathname?.startsWith("/blog/") && pathname !== "/blog";
    const topPlacement = isCalculatorRoute
        ? "calculatorsTop"
        : isBlogPostRoute
          ? "blogPostTop"
          : null;
    const bottomPlacement = isCalculatorRoute
        ? "calculatorsBottom"
        : isBlogPostRoute
          ? "blogPostBottom"
          : null;

    return (
        <div>
            <Navbar />
            <ToastContainer />
            <div className={`${className}`}>
                {topPlacement ? (
                    <div className="container mx-auto px-4 pt-8 md:px-6 2xl:max-w-[1400px]">
                        <AdsenseAd placement={topPlacement} />
                    </div>
                ) : null}

                {children}

                {bottomPlacement ? (
                    <div className="container mx-auto px-4 pb-10 pt-2 md:px-6 2xl:max-w-[1400px]">
                        <AdsenseAd placement={bottomPlacement} />
                    </div>
                ) : null}
            </div>
            <Footer />
        </div>
    );
};

export default Wrapper;
