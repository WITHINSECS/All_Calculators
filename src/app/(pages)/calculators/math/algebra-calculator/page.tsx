"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";
import * as math from "mathjs";

const AlgebraCalculator = () => {
    const [expression, setExpression] = useState("");
    const [result, setResult] = useState<string | number>("");
    const [error, setError] = useState<string | null>(null);

    // Handle user input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpression(e.target.value);
    };

    // Function to calculate the result
    const handleCalculate = () => {
        setError(null);
        try {
            // Check if the expression is to evaluate a specific value
            if (expression.includes("@")) {
                const parts = expression.split("@");
                const expr = parts[0].trim();
                const values = parts[1].trim();
                // Parse values like x=5, y=3
                const vars: { [key: string]: number } = values.split(",").reduce((acc: { [key: string]: number }, pair) => {
                    const [key, val] = pair.split("=");
                    acc[key.trim()] = parseFloat(val.trim());
                    return acc;
                }, {});

                const evaluatedExpression = math.evaluate(expr, vars);
                setResult(evaluatedExpression);
            } else if (expression.includes("=")) {
                // Solve equations like '4x + 2 = 2(x + 6)'
                const solution = math.simplify(expression); // Using simplify to try solving
                setResult(solution.toString());
            } else {
                // Simplify or evaluate normal expressions
                const simplified = math.simplify(expression).toString();
                setResult(simplified);
            }
        } catch (e) {
            setError("Invalid expression. Please check the syntax.");
            setResult("");
        }
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Algebra Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate algebraic expressions, solve equations, or evaluate for variable values.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Input for expression */}
                    <div className="space-y-2">
                        <Label>What do you want to calculate?</Label>
                        <Input
                            className="mt-2 mb-3"
                            value={expression}
                            onChange={handleChange}
                            placeholder="Enter an expression"
                        />
                    </div>

                    {/* Calculate Button */}
                    <div className="flex justify-center">
                        <Button className="w-full p-5" onClick={handleCalculate}>
                            Calculate It!
                        </Button>
                    </div>
                </div>

                {/* Error Message */}
                {error && <div className="mt-4 text-red-500">{error}</div>}

                {/* Result Display */}
                <div className="mt-4">
                    <h3 className="text-xl">Answer:</h3>
                    <div className="text-2xl">{result}</div>
                </div>

                {/* Examples */}
                <div className="mt-6 text-sm text-gray-600">
                    <h4>Examples:</h4>
                    <ul>
                        <li>1 + 2, 1/3 + 1/4, 2^3 * 2^2</li>
                        <li>(x + 1)(x + 2) (Simplify Example)</li>
                        <li>2x^2 + 2y @ x=5, y=3 (Evaluate Example)</li>
                        <li>4x + 2 = 2(x + 6) (Solve Example)</li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    );
};

export default AlgebraCalculator;