"use client";

import { useEffect, useRef, useState } from "react";
import { evaluate } from "mathjs";
import { Calculator, CornerDownLeft, Delete, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CalculatorButton = {
    label: string;
    type?: "default" | "accent" | "primary";
    action?: "insert" | "backspace" | "clear" | "evaluate" | "answer";
    value?: string;
};

const scientificButtons: CalculatorButton[] = [
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "sqrt", value: "sqrt(" },
    { label: "ln", value: "log(" },
    { label: "log10", value: "log10(" },
    { label: "x^2", value: "^2" },
    { label: "x^3", value: "^3" },
    { label: "pi", value: "pi" },
    { label: "e", value: "e" },
    { label: "^", value: "^" },
    { label: "%", value: "%" },
];

const keypadButtons: CalculatorButton[] = [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "/", value: "/" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "*", value: "*" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "-", value: "-" },
    { label: "0", value: "0" },
    { label: ".", value: "." },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
    { label: "Ans", action: "answer", type: "accent" },
    { label: "Back", action: "backspace", type: "accent" },
    { label: "AC", action: "clear", type: "accent" },
    { label: "+", value: "+", type: "default" },
    { label: "=", action: "evaluate", type: "primary" },
];

const presets = [
    "12*(18+4)",
    "sqrt(144)+18",
    "sin(pi/2)+5",
];

function formatResult(result: unknown) {
    if (typeof result === "number") {
        if (!Number.isFinite(result)) {
            return "Error";
        }

        return Number(result.toPrecision(12)).toString();
    }

    return String(result);
}

export default function HeroCalculator() {
    const [expression, setExpression] = useState("0");
    const [lastAnswer, setLastAnswer] = useState("");
    const expressionRef = useRef(expression);
    const lastAnswerRef = useRef(lastAnswer);

    useEffect(() => {
        expressionRef.current = expression;
    }, [expression]);

    useEffect(() => {
        lastAnswerRef.current = lastAnswer;
    }, [lastAnswer]);

    function insertValue(value: string) {
        setExpression((current) => {
            if (current === "0" || current === "Error") {
                return value;
            }

            return `${current}${value}`;
        });
    }

    function clearExpression() {
        setExpression("0");
    }

    function backspace() {
        setExpression((current) => {
            if (current === "Error") {
                return "0";
            }

            return current.slice(0, -1) || "0";
        });
    }

    function insertAnswer() {
        if (!lastAnswerRef.current) {
            return;
        }

        insertValue(lastAnswerRef.current);
    }

    function runEvaluation() {
        try {
            const result = evaluate(expressionRef.current);
            const nextValue = formatResult(result);

            setLastAnswer(nextValue === "Error" ? lastAnswerRef.current : nextValue);
            setExpression(nextValue);
        } catch {
            setExpression("Error");
        }
    }

    function handleButtonClick(button: CalculatorButton) {
        switch (button.action ?? "insert") {
            case "backspace":
                backspace();
                break;
            case "clear":
                clearExpression();
                break;
            case "evaluate":
                runEvaluation();
                break;
            case "answer":
                insertAnswer();
                break;
            case "insert":
            default:
                insertValue(button.value ?? button.label);
                break;
        }
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const key = event.key;

            if (/^[0-9+\-*/().^%]$/.test(key)) {
                setExpression((current) => {
                    if (current === "0" || current === "Error") {
                        return key;
                    }

                    return `${current}${key}`;
                });
                return;
            }

            if (key === "Enter") {
                event.preventDefault();

                try {
                    const result = evaluate(expressionRef.current);
                    const nextValue = formatResult(result);

                    setLastAnswer(nextValue === "Error" ? lastAnswerRef.current : nextValue);
                    setExpression(nextValue);
                } catch {
                    setExpression("Error");
                }
                return;
            }

            if (key === "Backspace") {
                event.preventDefault();

                setExpression((current) => {
                    if (current === "Error") {
                        return "0";
                    }

                    return current.slice(0, -1) || "0";
                });
                return;
            }

            if (key === "Escape") {
                event.preventDefault();
                setExpression("0");
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.18),transparent_35%)]" />

            <div className="relative space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.32em] text-slate-500 uppercase">
                            Live Calculator
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-950">
                            Test a calculation before opening a full tool
                        </h2>
                    </div>

                    <Badge className="rounded-full bg-slate-900 px-3 py-1 text-white hover:bg-slate-900">
                        <Calculator className="size-3.5" />
                        Instant
                    </Badge>
                </div>

                <div className="rounded-[26px] bg-slate-950 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                        <span>Expression</span>
                        <span>Ready</span>
                    </div>
                    <div className="mt-4 min-h-[4.5rem] break-all font-mono text-3xl leading-tight">
                        {expression}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span>Last answer: {lastAnswer || "None yet"}</span>
                        <span>Keyboard input enabled</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => setExpression(preset)}
                            className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-slate-900"
                        >
                            Try {preset}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {scientificButtons.map((button) => (
                        <button
                            key={button.label}
                            type="button"
                            onClick={() => handleButtonClick(button)}
                            className="rounded-2xl border border-white/70 bg-white/90 px-3 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50"
                        >
                            {button.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {keypadButtons.map((button) => (
                        <button
                            key={button.label}
                            type="button"
                            onClick={() => handleButtonClick(button)}
                            className={cn(
                                "rounded-2xl px-3 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
                                button.type === "primary"
                                    ? "col-span-4 border border-slate-900 bg-slate-900 text-white shadow-lg hover:bg-slate-800"
                                    : button.type === "accent"
                                      ? "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                                      : "border border-white/70 bg-white/90 text-slate-700 shadow-sm hover:border-sky-200 hover:bg-sky-50"
                            )}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {button.label === "Back" ? <Delete className="size-4" /> : null}
                                {button.label === "AC" ? <RotateCcw className="size-4" /> : null}
                                {button.label === "=" ? (
                                    <CornerDownLeft className="size-4" />
                                ) : null}
                                {button.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
