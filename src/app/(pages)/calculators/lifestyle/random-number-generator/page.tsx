"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function to generate random number
const generateRandomNumber = (
    min: number,
    max: number,
    isDecimal: boolean
) => {
    const random = Math.random() * (max - min) + min;
    return isDecimal ? random : Math.floor(random); // If isDecimal is true, return a decimal number, else return integer
};

export default function RandomNumberGenerator() {
    const [minValue, setMinValue] = useState<string>(""); // Empty by default
    const [maxValue, setMaxValue] = useState<string>(""); // Empty by default
    const [isDecimal, setIsDecimal] = useState<boolean>(false);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);

    const handleGenerateRandomNumber = () => {
        const min = parseFloat(minValue);
        const max = parseFloat(maxValue);

        if (isNaN(min) || isNaN(max) || min >= max) {
            alert("Please enter valid minimum and maximum values.");
            return;
        }

        const result = generateRandomNumber(min, max, isDecimal);
        setRandomNumber(result);
    };

    const handleClear = () => {
        setMinValue("");
        setMaxValue("");
        setRandomNumber(null);
        setIsDecimal(false);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Random Number Generator</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Generate a random number within a specified range.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Minimum Value Input */}
                    <div className="space-y-2">
                        <Label htmlFor="min-value">Minimum Value</Label>
                        <Input
                            id="min-value"
                            type="number"
                            value={minValue}
                            onChange={(e) => setMinValue(e.target.value)}
                            placeholder="Enter minimum value"
                        />
                    </div>

                    {/* Maximum Value Input */}
                    <div className="space-y-2">
                        <Label htmlFor="max-value">Maximum Value</Label>
                        <Input
                            id="max-value"
                            type="number"
                            value={maxValue}
                            onChange={(e) => setMaxValue(e.target.value)}
                            placeholder="Enter maximum value"
                        />
                    </div>

                    {/* Type of Number (Integer/Decimal) */}
                    <div className="space-y-2">
                        <Label htmlFor="number-type">Number Type</Label>
                        <Select
                            onValueChange={(value) => setIsDecimal(value === "decimal")}
                            value={isDecimal ? "decimal" : "integer"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Number Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="integer">Integer</SelectItem>
                                <SelectItem value="decimal">Decimal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Generate Random Number Button */}
                    <Button onClick={handleGenerateRandomNumber}>Generate Random Number</Button>

                    {/* Display Random Number */}
                    {randomNumber !== null && (
                        <div className="mt-4">
                            <div className="rounded-md border p-4">
                                <div className="text-sm text-muted-foreground mb-1">Generated Random Number</div>
                                <div className="text-xl font-semibold">{randomNumber}</div>
                            </div>
                        </div>
                    )}

                    {/* Clear Button */}
                    <Button onClick={handleClear} variant="secondary" className="mt-4">
                        Clear
                    </Button>
                </div>
            </div>
        </Wrapper>
    );
}