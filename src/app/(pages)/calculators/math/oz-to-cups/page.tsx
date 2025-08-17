"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OzToCupsConverter() {
    const [ounces, setOunces] = useState<string>(""); // User input for ounces
    const [cupType, setCupType] = useState<string>("usCustomary"); // Default cup type to US Customary
    const [convertedValue, setConvertedValue] = useState<number | null>(null);

    // Conversion factors
    const OUNCES_TO_US_CUSTOMARY_CUP = 8;   // 1 US Customary Cup = 8 oz
    const OUNCES_TO_US_LEGAL_CUP = 8.45;    // 1 US Legal Cup = 8.45 oz
    const OUNCES_TO_UK_CUP = 10;            // 1 UK Cup = 10 oz

    // Handle conversion logic based on selected cup type
    const handleConvert = () => {
        const ozValue = parseFloat(ounces);

        if (isNaN(ozValue) || ozValue <= 0) {
            alert("Please enter a valid number for ounces.");
            return;
        }

        let result = 0;

        switch (cupType) {
            case "usCustomary":
                result = ozValue / OUNCES_TO_US_CUSTOMARY_CUP;
                break;
            case "usLegal":
                result = ozValue / OUNCES_TO_US_LEGAL_CUP;
                break;
            case "uk":
                result = ozValue / OUNCES_TO_UK_CUP;
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
                    <h1 className="text-2xl font-semibold lg:text-4xl">Ounces to Cups Converter</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Convert ounces to different cup units: US Customary, US Legal, or UK Cups.
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

                    {/* Cup Type Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="cup-type">Convert to</Label>
                        <Select
                            onValueChange={setCupType}
                            value={cupType}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select cup type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="usCustomary">US Customary Cup</SelectItem>
                                <SelectItem value="usLegal">US Legal Cup</SelectItem>
                                <SelectItem value="uk">UK Cup</SelectItem>
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
                                    {convertedValue.toFixed(2)} {cupType === "usCustomary" ? "US Customary Cups" : cupType === "usLegal" ? "US Legal Cups" : "UK Cups"}
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