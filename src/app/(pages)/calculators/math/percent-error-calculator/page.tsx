"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";

function trimZeros(n: number, precision: number): string {
    const s = n.toFixed(precision);
    return s.replace(/\.0+$|(?<=\.\d*[1-9])0+$/g, "");
}

interface Results {
    absError: number; // |observed - true|
    percentError: number; // 0..100
    relError: number; // 0..1
    diffSigned: number; // observed - true
}

export default function PercentErrorCalculator(): JSX.Element {
    const [precision, setPrecision] = useState<number>(2);

    // inputs as strings so they can be empty
    const [trueInput, setTrueInput] = useState<string>("");
    const [observedInput, setObservedInput] = useState<string>("");
    const [percentOut, setPercentOut] = useState<string>("");

    const [results, setResults] = useState<Results | null>(null);

    const calculate = (): void => {
        if (trueInput.trim() === "" || observedInput.trim() === "") {
            toast.error("Enter both the true value and the observed value.");
            return;
        }
        const T = Number(trueInput);
        const O = Number(observedInput);

        if (!Number.isFinite(T) || T === 0) { toast.error("True value must be a non‑zero number."); return; }
        if (!Number.isFinite(O)) { toast.error("Observed value must be a number."); return; }

        const absError = Math.abs(O - T);
        const relError = absError / Math.abs(T);
        const percentError = relError * 100;

        setPercentOut(trimZeros(percentError, precision));
        setResults({ absError, percentError, relError, diffSigned: O - T });
    };

    const clearAll = (): void => {
        setTrueInput("");
        setObservedInput("");
        setPercentOut("");
        setResults(null);
    };

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Percent Error Calculator</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Compute |observed − true| ÷ |true| × 100 with a clean shadcn UI.</p>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-2">
                        <CardTitle>Inputs</CardTitle>
                        <div className="flex items-center gap-2">
                            <Label className="text-sm">Precision</Label>
                            <Select value={String(precision)} onValueChange={(v: string) => setPrecision(Number(v))}>
                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">0</SelectItem>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label>True value</Label>
                            <Input type="number" inputMode="decimal" value={trueInput} onChange={(e) => setTrueInput(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Observed value</Label>
                            <Input type="number" inputMode="decimal" value={observedInput} onChange={(e) => setObservedInput(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Percent error</Label>
                            <div className="flex items-center gap-3">
                                <Input readOnly value={percentOut} placeholder="%" />
                                <div className="px-3 py-2 rounded-md border text-sm">%</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <Button onClick={calculate}>Calculate</Button>
                            <Button variant="secondary" onClick={clearAll}>Clear</Button>
                        </div>

                        <Separator />

                        {results ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border rounded-md p-4 space-y-2">
                                    <div className="text-sm text-muted-foreground">Absolute error</div>
                                    <div className="text-xl font-semibold">{trimZeros(results.absError, precision)}</div>
                                    <div className="text-sm text-muted-foreground">Relative error</div>
                                    <div className="text-xl font-semibold">{trimZeros(results.relError, Math.min(precision + 2, 6))}</div>
                                </div>
                                <div className="border rounded-md p-4 space-y-2">
                                    <div className="text-sm text-muted-foreground">Signed difference (Observed − True)</div>
                                    <div className="text-xl font-semibold">{trimZeros(results.diffSigned, precision)}</div>
                                    <div className="text-sm text-muted-foreground">Percent error</div>
                                    <div className="text-xl font-semibold">{trimZeros(results.percentError, precision)}%</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">Enter values and press <b>Calculate</b>.</div>
                        )}

                        <Separator />
                        <div className="text-sm text-muted-foreground">
                            Formula: <code>|observed − true| ÷ |true| × 100%</code>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}
