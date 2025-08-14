"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";

interface CalculatorInput {
    display: string;
    angleMode: "deg" | "rad"; // Degree or Radian
    memory: number;
    previousInput: string;
}

const ScientificCalculator = () => {
    const [input, setInput] = useState<CalculatorInput>({
        display: "0",
        angleMode: "deg",
        memory: 0,
        previousInput: "",
    });

    // Handle button clicks
    const handleButtonClick = (value: string) => {
        if (value === "AC") {
            setInput((prev) => ({ ...prev, display: "0", previousInput: "" }));
        } else if (value === "Back") {
            setInput((prev) => ({
                ...prev,
                display: prev.display.slice(0, -1) || "0",
            }));
        } else if (value === "=") {
            calculateResult();
        } else if (value === "EXP") {
            setInput((prev) => ({ ...prev, display: "e" }));
        } else if (value === "pi") {
            setInput((prev) => ({ ...prev, display: "π" }));
        } else {
            setInput((prev) => ({
                ...prev,
                display: prev.display === "0" ? value : prev.display + value,
            }));
        }
    };

    // Calculate the result
    const calculateResult = () => {
        try {
            let result = eval(input.display);
            if (input.angleMode === "deg") {
                result = result * (Math.PI / 180); // Convert to radians if in degree mode
            }
            setInput((prev) => ({ ...prev, display: result.toString() }));
        } catch (e) {
            setInput((prev) => ({ ...prev, display: "Error" }));
        }
    };

    // Handle scientific operations (sin, cos, tan, etc.)
    const scientificOperation = (operation: string) => {
        const num = parseFloat(input.display);
        let result;

        switch (operation) {
            case "sin":
                result = input.angleMode === "deg" ? Math.sin((num * Math.PI) / 180) : Math.sin(num);
                break;
            case "cos":
                result = input.angleMode === "deg" ? Math.cos((num * Math.PI) / 180) : Math.cos(num);
                break;
            case "tan":
                result = input.angleMode === "deg" ? Math.tan((num * Math.PI) / 180) : Math.tan(num);
                break;
            case "sin⁻¹":
                result = Math.asin(num) * (input.angleMode === "deg" ? 180 / Math.PI : 1);
                break;
            case "cos⁻¹":
                result = Math.acos(num) * (input.angleMode === "deg" ? 180 / Math.PI : 1);
                break;
            case "tan⁻¹":
                result = Math.atan(num) * (input.angleMode === "deg" ? 180 / Math.PI : 1);
                break;
            case "log":
                result = Math.log10(num);
                break;
            case "ln":
                result = Math.log(num);
                break;
            case "x²":
                result = Math.pow(num, 2);
                break;
            case "x³":
                result = Math.pow(num, 3);
                break;
            case "√":
                result = Math.sqrt(num);
                break;
            case "xⁿ":
                result = Math.pow(num, Number(input.previousInput));
                break;
            default:
                return;
        }

        setInput((prev) => ({ ...prev, display: result.toString() }));
    };

    // Toggle between radian and degree mode
    const toggleAngleMode = () => {
        setInput((prev) => ({ ...prev, angleMode: prev.angleMode === "deg" ? "rad" : "deg" }));
    };

    // Memory operations
    const memoryAdd = () => {
        setInput((prev) => ({
            ...prev,
            memory: prev.memory + parseFloat(prev.display),
        }));
    };

    const memorySubtract = () => {
        setInput((prev) => ({
            ...prev,
            memory: prev.memory - parseFloat(prev.display),
        }));
    };

    const memoryRecall = () => {
        setInput((prev) => ({
            ...prev,
            display: prev.memory.toString(),
        }));
    };

    const memoryClear = () => {
        setInput((prev) => ({
            ...prev,
            memory: 0,
        }));
    };

    return (
        <Wrapper>
            <div className="container max-w-2xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Scientific Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        A scientific calculator with scientific operations and memory functions.
                    </p>
                </div>

                {/* Display */}
                <div className="display mb-4">
                    <input
                        type="text"
                        className="w-full p-4 text-2xl text-right border rounded-md"
                        value={input.display}
                        disabled
                    />
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-4 gap-4">
                    {/* Row 1 */}
                    <Button onClick={() => handleButtonClick("AC")}>AC</Button>
                    <Button onClick={() => handleButtonClick("Back")}>Back</Button>
                    <Button onClick={() => handleButtonClick("EXP")}>EXP</Button>
                    <Button onClick={() => handleButtonClick("pi")}>π</Button>

                    {/* Row 2 */}
                    <Button onClick={() => scientificOperation("sin")}>sin</Button>
                    <Button onClick={() => scientificOperation("cos")}>cos</Button>
                    <Button onClick={() => scientificOperation("tan")}>tan</Button>
                    <Button onClick={() => scientificOperation("sin⁻¹")}>sin⁻¹</Button>

                    {/* Row 3 */}
                    <Button onClick={() => scientificOperation("cos⁻¹")}>cos⁻¹</Button>
                    <Button onClick={() => scientificOperation("tan⁻¹")}>tan⁻¹</Button>
                    <Button onClick={() => scientificOperation("x²")}>x²</Button>
                    <Button onClick={() => scientificOperation("x³")}>x³</Button>

                    {/* Row 4 */}
                    <Button onClick={() => scientificOperation("√")}>√</Button>
                    <Button onClick={() => handleButtonClick("7")}>7</Button>
                    <Button onClick={() => handleButtonClick("8")}>8</Button>
                    <Button onClick={() => handleButtonClick("9")}>9</Button>

                    {/* Row 5 */}
                    <Button onClick={() => scientificOperation("xⁿ")}>xⁿ</Button>
                    <Button onClick={() => handleButtonClick("4")}>4</Button>
                    <Button onClick={() => handleButtonClick("5")}>5</Button>
                    <Button onClick={() => handleButtonClick("6")}>6</Button>

                    {/* Row 6 */}
                    <Button onClick={() => scientificOperation("log")}>log</Button>
                    <Button onClick={() => scientificOperation("ln")}>ln</Button>
                    <Button onClick={() => handleButtonClick("1")}>1</Button>
                    <Button onClick={() => handleButtonClick("2")}>2</Button>

                    {/* Row 7 */}
                    <Button onClick={() => handleButtonClick("3")}>3</Button>
                    <Button onClick={() => handleButtonClick("0")}>0</Button>
                    <Button onClick={() => handleButtonClick(".")}>.</Button>
                    <Button onClick={() => handleButtonClick("=")}>=</Button>

                    {/* Row 8 */}
                    <Button onClick={toggleAngleMode}>Deg/Rad</Button>
                    <Button onClick={memoryAdd}>M+</Button>
                    <Button onClick={memorySubtract}>M-</Button>
                    <Button onClick={memoryRecall}>MR</Button>
                </div>
            </div>
        </Wrapper>
    );
};

export default ScientificCalculator;
