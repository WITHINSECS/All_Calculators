"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Wrapper from "@/app/Wrapper";

const units: Record<string, number> = {
    Meter: 1,
    Kilometer: 0.001,
    Centimeter: 100,
    Millimeter: 1000,
    Micrometer: 1000000,
    Nanometer: 1000000000,
    Mile: 0.00062137119,
    Yard: 1.0936132983,
    Foot: 3.280839895,
    Inch: 39.37007874,
    "Light Year": 1.057008707e-15,
};

const UnitConverter = () => {
    const [fromValue, setFromValue] = useState("");
    const [fromUnit, setFromUnit] = useState("Meter");
    const [toUnit, setToUnit] = useState("Meter");
    const [result, setResult] = useState<string>("");

    const handleConvert = () => {
        const value = parseFloat(fromValue || "0");
        const fromFactor = units[fromUnit];
        const toFactor = units[toUnit];
        const converted = (value * toFactor) / fromFactor;
        setResult(`${fromValue} ${fromUnit} = ${converted} ${toUnit}`);
    };

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
                <h1 className="text-2xl font-semibold lg:text-4xl">Unit Converter</h1>
                <p className="text-muted-foreground mt-4 text-xl">
                    Convert values from one unit to another easily.
                </p>
            </div>

            <div className="max-w-6xl lg:px-12 w-full mx-auto p-4">
                <div className="grid gap-6 md:grid-cols-1">
                    {/* From Value */}
                    <div className="space-y-4">
                        <div>
                            <Label>From:</Label>
                            <Input
                                type="number"
                                value={fromValue}
                                onChange={(e) => setFromValue(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>From Unit:</Label>
                            <Select onValueChange={setFromUnit} defaultValue={fromUnit}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(units).map((unit) => (
                                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>To Unit:</Label>
                            <Select onValueChange={setToUnit} defaultValue={toUnit}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(units).map((unit) => (
                                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full mt-4" onClick={handleConvert}>Convert</Button>
                    </div>
                </div>

                {/* Result */}
                {result && (
                    <div className="mt-10 text-center text-lg font-medium text-red-600">
                        Result: {result}
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default UnitConverter;