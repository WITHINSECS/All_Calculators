"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Fraction = { numerator: number; denominator: number };

const gcd = (a: number, b: number): number => {
    if (b === 0) return a;
    return gcd(b, a % b);
};

const simplifyFraction = (fraction: Fraction): Fraction => {
    const commonDivisor = gcd(fraction.numerator, fraction.denominator);
    return {
        numerator: fraction.numerator / commonDivisor,
        denominator: fraction.denominator / commonDivisor,
    };
};

const fractionToDecimal = (fraction: Fraction): number => {
    return fraction.numerator / fraction.denominator;
};

const parseFraction = (fractionStr: string): Fraction | null => {
    const [numerator, denominator] = fractionStr.split("/").map(Number);
    if (!denominator || isNaN(numerator) || isNaN(denominator)) {
        return null;
    }
    return { numerator, denominator };
};

const performOperation = (
    fraction1: Fraction,
    fraction2: Fraction,
    operator: string
): Fraction | null => {
    let result: Fraction | null = null;
    switch (operator) {
        case "+":
            result = {
                numerator: fraction1.numerator * fraction2.denominator + fraction2.numerator * fraction1.denominator,
                denominator: fraction1.denominator * fraction2.denominator,
            };
            break;
        case "-":
            result = {
                numerator: fraction1.numerator * fraction2.denominator - fraction2.numerator * fraction1.denominator,
                denominator: fraction1.denominator * fraction2.denominator,
            };
            break;
        case "*":
            result = {
                numerator: fraction1.numerator * fraction2.numerator,
                denominator: fraction1.denominator * fraction2.denominator,
            };
            break;
        case "/":
            result = {
                numerator: fraction1.numerator * fraction2.denominator,
                denominator: fraction1.denominator * fraction2.numerator,
            };
            break;
        default:
            return null;
    }

    return result ? simplifyFraction(result) : null;
};

export default function FractionCalculator() {
    const [input, setInput] = useState<string>("");
    const [operation, setOperation] = useState<string>("+");
    const [result, setResult] = useState<Fraction | null>(null);
    const [decimalResult, setDecimalResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [steps, setSteps] = useState<string[] | null>(null);

    const onCalculate = () => {
        setError(null);
        setResult(null);
        setDecimalResult(null);
        setSteps(null);

        const parts = input.replace(/\s+/g, "").split(operation);
        if (parts.length !== 2) {
            setError("Please include one operator (+, -, *, /) and two fractions.");
            return;
        }

        const fraction1 = parseFraction(parts[0]);
        const fraction2 = parseFraction(parts[1]);

        if (!fraction1 || !fraction2) {
            setError("Invalid fractions. Please use the format 'a/b'.");
            return;
        }

        const resultFraction = performOperation(fraction1, fraction2, operation);
        if (resultFraction) {
            const decimal = fractionToDecimal(resultFraction);
            setResult(resultFraction);
            setDecimalResult(decimal);
            setSteps([
                `Fraction 1: ${fraction1.numerator}/${fraction1.denominator}`,
                `Fraction 2: ${fraction2.numerator}/${fraction2.denominator}`,
                `Result: ${resultFraction.numerator}/${resultFraction.denominator}`,
                `Decimal Result: ${decimal}`,
            ]);
        } else {
            setError("Invalid operation.");
        }
    };

    const onClear = () => {
        setInput("");
        setError(null);
        setResult(null);
        setDecimalResult(null);
        setSteps(null);
    };

    const onExample = () => {
        setInput("1/3 + 1/4");
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Fractions Calculator</h1>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="input">What do you want to calculate?</Label>
                    <div className="flex gap-2">
                        <Input
                            id="input"
                            className="flex-1"
                            placeholder="e.g. 1/3 + 1/4"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button onClick={onCalculate}>Calculate It!</Button>
                    </div>
                    <div className="text-sm text-muted-foreground">Example: 1/3 + 1/4</div>
                </div>

                <div className="mt-8 space-y-3">
                    <div className="text-xl font-semibold">Example (Click to try)</div>
                    <Button variant="secondary" onClick={onExample} className="font-semibold">
                        1/3 + 1/4
                    </Button>
                </div>

                {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

                {result && (
                    <div className="mt-8 space-y-4">
                        <div className="rounded-md border p-4">
                            <div className="text-sm text-muted-foreground mb-1">Result</div>
                            <div className="text-xl font-semibold">
                                {result.numerator}/{result.denominator}
                            </div>
                            <div className="text-sm text-muted-foreground">Decimal: {decimalResult}</div>
                        </div>

                        {steps && (
                            <div className="rounded-md border p-4">
                                <div className="mb-2 font-medium">Steps</div>
                                <pre className="whitespace-pre-wrap font-mono text-sm">
                                    {steps.join("\n")}
                                </pre>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button onClick={onClear} variant="secondary">Clear</Button>
                        </div>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
