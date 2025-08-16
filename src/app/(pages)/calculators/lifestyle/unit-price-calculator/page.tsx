"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UnitPriceCalculator() {
    const [price, setPrice] = useState<string>(""); // Default to empty
    const [multiPackSize, setMultiPackSize] = useState<string>(""); // Default to empty
    const [unit, setUnit] = useState<string>("Pound (lb)"); // Default unit is Pound (lb)
    const [unitPrice, setUnitPrice] = useState<number | null>(null);

    const handleCalculateUnitPrice = () => {
        const priceNum = parseFloat(price);
        const sizeNum = parseFloat(multiPackSize);

        // Validate inputs
        if (isNaN(priceNum) || isNaN(sizeNum) || priceNum <= 0 || sizeNum <= 0) {
            alert("Please enter valid numbers for price and size.");
            return;
        }

        // Calculate unit price
        const unitPriceResult = priceNum / sizeNum;
        setUnitPrice(unitPriceResult);
    };

    const handleClear = () => {
        setPrice("");
        setMultiPackSize("");
        setUnit("Pound (lb)");
        setUnitPrice(null);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Unit Price Calculator</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Calculate the unit price based on the total price and multi-pack size.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Price Input */}
                    <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                        />
                    </div>

                    {/* Multi-pack Size Input */}
                    <div className="space-y-2">
                        <Label htmlFor="multi-pack-size">Multi-pack Size</Label>
                        <Input
                            id="multi-pack-size"
                            type="number"
                            value={multiPackSize}
                            onChange={(e) => setMultiPackSize(e.target.value)}
                            placeholder="Enter multi-pack size"
                        />
                    </div>

                    {/* Unit Selection Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select
                            onValueChange={setUnit}
                            value={unit}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pound (lb)">Pound (lb)</SelectItem>
                                <SelectItem value="Kilogram (kg)">Kilogram (kg)</SelectItem>
                                <SelectItem value="Ounce (oz)">Ounce (oz)</SelectItem>
                                <SelectItem value="Gram (g)">Gram (g)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Unit Price Per Selection Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="unit-price-per">Per</Label>
                        <Select
                            onValueChange={(value) => { }}
                            value="lb" // Default to lb for simplicity, can be enhanced further if needed
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="per" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lb">lb</SelectItem>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="oz">oz</SelectItem>
                                <SelectItem value="g">g</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Calculate Unit Price Button */}
                    <Button onClick={handleCalculateUnitPrice}>Calculate Unit Price</Button>

                    {/* Display Results */}
                    {unitPrice !== null && (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-md border p-4">
                                <div className="text-sm text-muted-foreground mb-1">Unit Price</div>
                                <div className="text-xl font-semibold">
                                    ${unitPrice.toFixed(2)} per {unit}
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