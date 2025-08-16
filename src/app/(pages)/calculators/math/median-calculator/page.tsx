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
    ReferenceLine,
} from "recharts";

type HistBin = {
    label: string;
    start: number;
    end: number;
    freq: number;
};

function parseNumbers(raw: string): number[] {
    return raw
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .map((t) => Number(t))
        .filter((v) => Number.isFinite(v));
}

function calcMedian(sorted: number[]): { median: number; midIdxA: number; midIdxB: number } {
    const n = sorted.length;
    if (n === 0) return { median: NaN, midIdxA: -1, midIdxB: -1 };
    if (n % 2 === 1) {
        const mid = Math.floor(n / 2);
        return { median: sorted[mid], midIdxA: mid, midIdxB: mid };
    } else {
        const a = n / 2 - 1;
        const b = n / 2;
        return { median: (sorted[a] + sorted[b]) / 2, midIdxA: a, midIdxB: b };
    }
}

// Sturges' rule for a sensible number of bins
function makeHistogram(data: number[]): HistBin[] {
    if (data.length === 0) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const k = Math.max(1, Math.ceil(Math.log2(data.length) + 1));
    const width = max === min ? 1 : (max - min) / k;

    const bins: HistBin[] = Array.from({ length: k }, (_v, i) => {
        const start = min + i * width;
        const end = i === k - 1 ? max : start + width; // include max in last bin
        const label =
            width === 1
                ? `${Math.round(start)}–${Math.round(end)}`
                : `${Number(start.toFixed(2))}–${Number(end.toFixed(2))}`;
        return { label, start, end, freq: 0 };
    });

    for (const v of data) {
        let idx = width === 0 ? 0 : Math.floor(((v - min) / (max - min || 1)) * k);
        if (idx >= k) idx = k - 1;
        bins[idx].freq += 1;
    }
    return bins;
}

export default function MedianCalculator() {
    const [numbers, setNumbers] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const values = useMemo(() => parseNumbers(numbers), [numbers]);
    const sorted = useMemo(() => [...values].sort((a, b) => a - b), [values]);
    const n = sorted.length;

    const { median, midIdxA, midIdxB } = useMemo(() => calcMedian(sorted), [sorted]);

    const bins = useMemo(() => makeHistogram(values), [values]);

    // Find which bin the median lies in (for the ReferenceLine)
    const medianBinLabel = useMemo(() => {
        if (!Number.isFinite(median) || bins.length === 0) return undefined;
        const bin = bins.find(
            (b, i) =>
                (median >= b.start && median < b.end) || (i === bins.length - 1 && median <= b.end)
        );
        return bin?.label;
    }, [median, bins]);

    const formulaLines = useMemo(() => {
        if (!show || n === 0 || Number.isNaN(median)) return null;

        if (n % 2 === 1) {
            // odd
            const midPos = Math.floor(n / 2) + 1; // 1-indexed
            return [
                "Median (odd n) = middle value of the sorted list",
                `Sorted: [ ${sorted.join(", ")} ]`,
                `n = ${n}, middle position = (n + 1) / 2 = (${n} + 1) / 2 = ${midPos}`,
                `Median = value at position ${midPos} = ${sorted[midIdxA]}`,
            ];
        } else {
            // even
            const aPos = midIdxA + 1;
            const bPos = midIdxB + 1;
            return [
                "Median (even n) = average of the two middle values",
                `Sorted: [ ${sorted.join(", ")} ]`,
                `n = ${n}, middle positions = n/2 and n/2 + 1 = ${aPos} and ${bPos}`,
                `Median = (x${aPos} + x${bPos}) / 2 = (${sorted[midIdxA]} + ${sorted[midIdxB]}) / 2 = ${median}`,
            ];
        }
    }, [show, n, median, sorted, midIdxA, midIdxB]);

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

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-3xl">
                <div className="mx-auto text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Median Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-lg">
                        Enter numbers separated by commas. We’ll show the count, median, and a histogram.
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="rounded-md border p-3">
                                    <div className="text-sm text-muted-foreground">Count</div>
                                    <div className="text-xl font-semibold">{n}</div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="text-sm text-muted-foreground">Sorted</div>
                                    <div className="text-sm break-words">[ {sorted.join(", ")} ]</div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="text-sm text-muted-foreground">Median</div>
                                    <div className="text-xl font-semibold">
                                        {Number.isFinite(median) ? Number(median.toFixed(4)) : "-"}
                                    </div>
                                </div>
                            </div>

                            {/* Histogram */}
                            <div className="rounded-md border p-3">
                                <div className="mb-3 font-medium">Distribution (Histogram)</div>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={bins}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="label" angle={-10} textAnchor="end" interval={0} height={60} />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="freq" />
                                            {medianBinLabel && (
                                                <ReferenceLine
                                                    x={medianBinLabel}
                                                    stroke="#ff0000"
                                                    label={{ value: "Median", position: "insideTop", fill: "#ff0000" }}
                                                />
                                            )}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Formula */}
                            <div className="rounded-md border p-3">
                                <div className="mb-2 font-medium">How the median was calculated</div>
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