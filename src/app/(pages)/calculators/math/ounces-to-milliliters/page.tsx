"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OuncesConverter() {
    const [ounces, setOunces] = useState<string>(""); // User input for ounces
    const [unit, setUnit] = useState<string>("milliliters"); // Default unit to convert to (milliliters)
    const [convertedValue, setConvertedValue] = useState<number | null>(null);

    // Conversion constants
    const OUNCES_TO_MILLILITERS = 29.5735;
    const OUNCES_TO_LITERS = 0.0295735;
    const OUNCES_TO_CENTIMETERS = 29.5735; // Equivalent to milliliters

    // Handle conversion logic based on selected unit
    const handleConvert = () => {
        const ozValue = parseFloat(ounces);

        if (isNaN(ozValue) || ozValue <= 0) {
            alert("Please enter a valid number for ounces.");
            return;
        }

        let result = 0;

        switch (unit) {
            case "milliliters":
                result = ozValue * OUNCES_TO_MILLILITERS;
                break;
            case "liters":
                result = ozValue * OUNCES_TO_LITERS;
                break;
            case "centimeters":
                result = ozValue * OUNCES_TO_CENTIMETERS;
                break;
            default:
                break;
        }

        setConvertedValue(result);
    };

    const handleClear = () => {
        setOunces("");
        setConvertedValue(null);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Ounces Converter</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Convert ounces to milliliters, centimeters, or liters based on your selection.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Ounces Input */}
                    <div className="space-y-2">
                        <Label htmlFor="ounces">Ounces</Label>
                        <Input
                            id="ounces"
                            value={ounces}
                            onChange={(e) => setOunces(e.target.value)}
                            placeholder="Enter ounces"
                        />
                    </div>

                    {/* Conversion Unit Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="unit">Convert to</Label>
                        <Select
                            onValueChange={setUnit}
                            value={unit}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select unit to convert to" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="milliliters">Milliliters (mL)</SelectItem>
                                <SelectItem value="liters">Liters (L)</SelectItem>
                                <SelectItem value="centimeters">Centimeters (cm)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Convert Button */}
                    <Button onClick={handleConvert}>Convert</Button>

                    {/* Display Result */}
                    {convertedValue !== null && (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-md border p-4">
                                <div className="text-sm text-muted-foreground mb-1">Converted Value</div>
                                <div className="text-xl font-semibold">
                                    {convertedValue.toFixed(2)} {unit === "milliliters" ? "mL" : unit === "liters" ? "L" : "cm"}
                                </div>
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
