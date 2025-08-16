"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

type FreqRow = { value: number; freq: number };

function parseNumbers(raw: string): number[] {
    return raw
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .map((t) => Number(t))
        .filter((v) => Number.isFinite(v));
}

function buildFrequency(values: number[]): FreqRow[] {
    const map = new Map<number, number>();
    for (const v of values) {
        map.set(v, (map.get(v) ?? 0) + 1);
    }
    const rows: FreqRow[] = Array.from(map.entries()).map(([value, freq]) => ({
        value,
        freq,
    }));
    rows.sort((a, b) => (a.value === b.value ? 0 : a.value < b.value ? -1 : 1));
    return rows;
}

function computeModes(freq: FreqRow[]): { modes: number[]; maxFreq: number } {
    if (freq.length === 0) return { modes: [], maxFreq: 0 };
    let max = 0;
    for (const r of freq) max = Math.max(max, r.freq);
    const modes = freq.filter((r) => r.freq === max).map((r) => r.value);
    return { modes, maxFreq: max };
}

export default function ModeCalculator() {
    const [numbers, setNumbers] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const values = useMemo(() => parseNumbers(numbers), [numbers]);
    const n = values.length;

    const freqRows = useMemo(() => buildFrequency(values), [values]);
    const { modes, maxFreq } = useMemo(() => computeModes(freqRows), [freqRows]);

    const onCalculate = () => {
        if (!numbers.trim()) {
            setError("Please enter numbers separated by commas.");
            setShow(false);
            return;
        }
        if (values.length === 0) {
            setError("No valid numbers found. Check your input.");
            setShow(false);
            return;
        }
        setError(null);
        setShow(true);
    };

    const onClear = () => {
        setNumbers("");
        setShow(false);
        setError(null);
    };

    const formulaLines = useMemo(() => {
        if (!show || n === 0) return null;
        const modesList = modes.length > 0 ? modes.join(", ") : "—";
        return [
            "Mode = value(s) that occur most frequently",
            `Values: [ ${values.join(", ")} ]`,
            `Frequencies: ${freqRows.map((r) => `${r.value}:${r.freq}`).join(", ")}`,
            `Highest frequency = ${maxFreq}`,
            `Mode${modes.length > 1 ? "s" : ""} = ${modesList}`,
        ];
    }, [show, n, values, freqRows, maxFreq, modes]);

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-3xl">
                <div className="mx-auto text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Mode Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-lg">
                        Enter numbers separated by commas. We’ll compute the mode, show counts, and plot the frequency distribution.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="numbers">Enter numbers</Label>
                        <textarea
                            id="numbers"
                            className="w-full border rounded-md p-3"
                            rows={3}
                            placeholder="e.g. 10, 2, 38, 23, 38, 23, 21"
                            value={numbers}
                            onChange={(e) => setNumbers(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={onCalculate}>Calculate</Button>
                        <Button variant="secondary" onClick={onClear}>
                            Clear
                        </Button>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    {show && n > 0 && (
                        <div className="space-y-5">
                            {/* Summary cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="rounded-md border p-3">
                                    <div className="text-sm text-muted-foreground">Count</div>
                                    <div className="text-xl font-semibold">{n}</div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="text-sm text-muted-foreground">Unique Values</div>
                                    <div className="text-xl font-semibold">{freqRows.length}</div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="text-sm text-muted-foreground">
                                        Mode{modes.length > 1 ? "s" : ""}
                                    </div>
                                    <div className="text-xl font-semibold">
                                        {modes.length > 0 ? modes.join(", ") : "No mode"}
                                    </div>
                                </div>
                            </div>

                            {/* Frequency table */}
                            <div className="rounded-md border p-3">
                                <div className="mb-2 font-medium">Frequency Table</div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                                    <div className="font-medium">Value</div>
                                    <div className="font-medium">Frequency</div>
                                    {freqRows.map((r) => (
                                        <div key={`val-${r.value}`} className="col-span-1">
                                            {r.value}
                                        </div>
                                    ))}
                                    {freqRows.map((r) => (
                                        <div key={`freq-${r.value}`} className="col-span-1">
                                            {r.freq}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bar chart */}
                            <div className="rounded-md border p-3">
                                <div className="mb-3 font-medium">Frequency Distribution</div>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={freqRows}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="value"
                                                type="category"
                                                interval={0}
                                                height={50}
                                            />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="freq" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* How it works / formula */}
                            <div className="rounded-md border p-3">
                                <div className="mb-2 font-medium">How the mode was found</div>
                                <pre className="whitespace-pre-wrap font-mono text-sm">
                                    {formulaLines?.join("\n")}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}