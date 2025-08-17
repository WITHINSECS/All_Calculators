"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AlcoholUnitCalculator() {
    // Step 1: Gender input
    const [gender, setGender] = useState<string>("");

    // Step 2: Number of drinks per week
    const [drinks, setDrinks] = useState({
        beerLager: "",
        canBeer: "",
        pintLower: "",
        pintHigher: "",
        alcopop: "",
        smallWine: "",
        standardWine: "",
        largeWine: "",
        smallFortifiedWine: "",
        largeFortifiedWine: "",
        singleShotSpirits: "",
        standardShotSpirits: "",
        doubleShotSpirits: "",
    });

    // Conversion values
    const drinkUnits = {
        beerLager: 1.7,        // 330ml, 5%
        canBeer: 2.7,          // 500ml, 5.5%
        pintLower: 2,          // 568ml, 3.6%
        pintHigher: 3,         // 568ml, 5.2%
        alcopop: 1.5,          // 275ml, 4.5%
        smallWine: 1.5,        // 125ml, 12%
        standardWine: 2.1,     // 175ml, 12%
        largeWine: 3,          // 250ml, 12%
        smallFortifiedWine: 0.9, // 50ml, 17.5%
        largeFortifiedWine: 1.3, // 75ml, 17.5%
        singleShotSpirits: 1,  // 25ml, 40%
        standardShotSpirits: 1.4, // 35ml, 40%
        doubleShotSpirits: 2, // 50ml, 40%
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, drinkType: string) => {
        setDrinks((prev) => ({
            ...prev,
            [drinkType]: e.target.value,
        }));
    };

    const calculateTotalUnits = () => {
        let totalUnits = 0;
        const breakdown = [];

        // Calculate units for each drink type
        for (const [drinkType, units] of Object.entries(drinks)) {
            if (units !== "") {
                const unitValue = drinkUnits[drinkType as keyof typeof drinkUnits];
                const drinkTotal = Number(units) * unitValue;
                totalUnits += drinkTotal;
                breakdown.push(`${capitalizeFirstLetter(drinkType)}: ${units} × ${unitValue} = ${drinkTotal.toFixed(2)} units`);
            }
        }

        return { totalUnits, breakdown };
    };

    const capitalizeFirstLetter = (str: string) => {
        return str.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
    };

    const handleSubmit = () => {
        const { totalUnits, breakdown } = calculateTotalUnits();
        setResult({
            totalUnits,
            breakdown,
        });
    };

    const [result, setResult] = useState<{ totalUnits: number; breakdown: string[] } | null>(null);

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
                <h1 className="text-2xl font-semibold lg:text-4xl text-center">Alcohol Unit Calculator</h1>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                    Calculate your weekly alcohol intake based on drink type, volume, and alcohol percentage.
                </p>

                {/* Step 1: Gender Selection */}
                <div className="space-y-4 mt-6">
                    <h2 className="text-xl font-semibold">Step 1: Gender</h2>
                    <Select
                        onValueChange={setGender}
                        value={gender}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="selfDescribe">Self Describe</SelectItem>
                            <SelectItem value="preferNotSay">Prefer Not to Say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Step 2: Number of Drinks per Week */}
                <div className="space-y-4 mt-6">
                    <h2 className="text-xl font-semibold">Step 2: Drinks per Week</h2>

                    {Object.keys(drinks).map((drinkType) => (
                        <div key={drinkType} className="space-y-2">
                            <Label>{capitalizeFirstLetter(drinkType.replace(/([A-Z])/g, " $1"))}</Label>
                            <Input
                                value={drinks[drinkType as keyof typeof drinks]}
                                onChange={(e) => handleChange(e, drinkType)}
                                type="number"
                                placeholder="Enter number of drinks"
                            />
                        </div>
                    ))}
                </div>

                {/* Calculate Button */}
                <Button onClick={handleSubmit} className="mt-4">
                    Calculate Alcohol Units
                </Button>

                {/* Display Results */}
                {result && (
                    <div className="mt-6 space-y-4">
                        <div className="rounded-lg shadow-lg border p-6">
                            <div className="text-xl font-semibold">Calculation Breakdown</div>
                            <div className="text-lg mt-4">
                                {result.breakdown.map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </div>
                            <div className="mt-4 text-lg font-semibold">
                                Total Weekly Units: {result.totalUnits.toFixed(2)} units
                            </div>
                        </div>
                    </div>
                )}

                {/* Clear Button */}
                <Button onClick={() => setResult(null)} variant="secondary" className="mt-4">
                    Clear
                </Button>
            </div>
        </Wrapper>
    );
}