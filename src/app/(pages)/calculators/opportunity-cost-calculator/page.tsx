"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

// ---------------- Types ----------------
type CurrencyCode = "USD" | "PKR" | "INR";

// ---------------- Utils ----------------
const fmt = (n: number, currency: CurrencyCode): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

// Effective after‑tax annual rate (simple model: tax paid on gains annually)
const afterTaxRate = (gross: number, taxPct: number) => Math.max(0, gross * (1 - taxPct / 100));

// ---------------- Page -----------------
export default function OpportunityCostCalculator(): JSX.Element {
    // Currency & amount
    const [currency, setCurrency] = useState<CurrencyCode>("PKR");
    const [principalInput, setPrincipalInput] = useState<string>("");

    // Returns & period
    const [annualReturnInput, setAnnualReturnInput] = useState<string>("3"); // %
    const [yearsInput, setYearsInput] = useState<string>("");
    const [monthsInput, setMonthsInput] = useState<string>("");

    // Taxes & inflation
    const [taxInput, setTaxInput] = useState<string>("12"); // %
    const [inflationInput, setInflationInput] = useState<string>("2.5"); // %

    const [results, setResults] = useState<
        | null
        | {
            fvAfterTax: number;
            interestAfterTax: number;
            realFV: number; // inflation‑adjusted FV
            opportunityCostReal: number; // realFV - principal
            curve: Array<{ name: string; nominal: number; real: number }>;
        }
    >(null);

    const validate = (): {
        P: number;
        r: number; // annual gross rate (0..1)
        y: number; // years (decimal)
        tax: number; // %
        inf: number; // %
    } | null => {
        if (principalInput === "") { toast.error("Enter an amount to invest."); return null; }
        const P = Number(principalInput);
        const rPct = Number(annualReturnInput);
        const y = (Number(yearsInput || 0) || 0) + (Number(monthsInput || 0) || 0) / 12;
        const tax = Number(taxInput);
        const inf = Number(inflationInput);

        if (!Number.isFinite(P) || P <= 0) { toast.error("Amount must be greater than 0."); return null; }
        if (!Number.isFinite(rPct) || rPct < 0) { toast.error("Annual return cannot be negative."); return null; }
        if (!Number.isFinite(y) || y <= 0) { toast.error("Investment period must be greater than 0."); return null; }
        if (!Number.isFinite(tax) || tax < 0) { toast.error("Income tax cannot be negative."); return null; }
        if (!Number.isFinite(inf) || inf < 0) { toast.error("Inflation rate cannot be negative."); return null; }

        return { P, r: rPct / 100, y, tax, inf };
    };

    const onCalculate = () => {
        const v = validate();
        if (!v) return;
        const { P, r, y, tax, inf } = v;

        // After‑tax rate (simple annual model)
        const rAfter = afterTaxRate(r, tax); // fraction per year

        // Compound annually for fractional years (use exponent)
        const fvAfterTax = P * Math.pow(1 + rAfter, y);
        const interestAfterTax = Math.max(0, fvAfterTax - P);

        // Inflation adjustment (real future value in today's money)
        const realFV = fvAfterTax / Math.pow(1 + inf / 100, y);
        const opportunityCostReal = Math.max(0, realFV - P);

        // Build a curve per whole year + last fractional step
        const yearsWhole = Math.floor(y);
        const remainder = y - yearsWhole;
        const curve: Array<{ name: string; nominal: number; real: number }> = [];

        for (let k = 0; k <= yearsWhole; k++) {
            const t = k;
            const nominal = P * Math.pow(1 + rAfter, t);
            const real = nominal / Math.pow(1 + inf / 100, t);
            curve.push({ name: `Y${k}`, nominal, real });
        }
        if (remainder > 0) {
            const t = y;
            const nominal = P * Math.pow(1 + rAfter, t);
            const real = nominal / Math.pow(1 + inf / 100, t);
            curve.push({ name: `${remainder.toFixed(2)}y`, nominal, real });
        }

        setResults({ fvAfterTax, interestAfterTax, realFV, opportunityCostReal, curve });
    };

    const onClear = () => {
        setPrincipalInput("");
        setYearsInput("");
        setMonthsInput("");
        setResults(null);
    };

    const currencySymbol = useMemo(() => ({ USD: "$", PKR: "₨", INR: "₹" }[currency] || ""), [currency]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-4xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Opportunity Cost Calculator</h1>
                    <p className="text-muted-foreground mt-3 text-lg">How much could your money grow after taxes and inflation?</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>If I invest the money</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Currency + Amount */}
                            <div className="space-y-2">
                                <Label>Amount to invest</Label>
                                <div className="flex items-center gap-3">
                                    <Select value={currency} onValueChange={(v: CurrencyCode) => setCurrency(v)}>
                                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD $</SelectItem>
                                            <SelectItem value="PKR">PKR ₨</SelectItem>
                                            <SelectItem value="INR">INR ₹</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 100000"
                                        value={principalInput}
                                        onChange={(e) => setPrincipalInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Return */}
                            <div className="space-y-2">
                                <Label>Annual return on savings</Label>
                                <div className="flex items-center gap-3">
                                    <Input type="number" value={annualReturnInput} onChange={(e) => setAnnualReturnInput(e.target.value)} />
                                    <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                </div>
                            </div>

                            {/* Period */}
                            <div className="space-y-2">
                                <Label>Investment period</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <Input type="number" placeholder="yrs" value={yearsInput} onChange={(e) => setYearsInput(e.target.value)} />
                                        <span className="text-sm text-muted-foreground">yrs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" placeholder="mos" value={monthsInput} onChange={(e) => setMonthsInput(e.target.value)} />
                                        <span className="text-sm text-muted-foreground">mos</span>
                                    </div>
                                </div>
                            </div>

                            {/* Taxes */}
                            <div className="space-y-2">
                                <Label>Income tax</Label>
                                <div className="flex items-center gap-3">
                                    <Input type="number" value={taxInput} onChange={(e) => setTaxInput(e.target.value)} />
                                    <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                </div>
                            </div>

                            {/* Inflation */}
                            <div className="space-y-2">
                                <Label>Annual inflation rate</Label>
                                <div className="flex items-center gap-3">
                                    <Input type="number" value={inflationInput} onChange={(e) => setInflationInput(e.target.value)} />
                                    <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-1">
                                <Button onClick={onCalculate}>Calculate</Button>
                                <Button variant="secondary" onClick={onClear}>Clear</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {results ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <KPI label="Total savings (after tax)" value={fmt(results.fvAfterTax, currency)} />
                                        <KPI label="Opportunity cost — inflation adjusted" value={fmt(results.opportunityCostReal, currency)} />
                                    </div>

                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={results.curve} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="fillNom" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsla(var(--primary),0.6)" />
                                                        <stop offset="95%" stopColor="hsla(var(--primary),0.1)" />
                                                    </linearGradient>
                                                    <linearGradient id="fillReal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsla(var(--secondary),0.6)" />
                                                        <stop offset="95%" stopColor="hsla(var(--secondary),0.1)" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(v: number) => fmt(v, currency)} width={90} />
                                                <Tooltip
                                                    formatter={(v: number | string) => fmt(Number(v), currency)}
                                                    contentStyle={{ borderRadius: 12 }}
                                                />
                                                <Legend />
                                                <Area type="monotone" dataKey="nominal" name="Nominal" stroke="hsl(var(--primary))" fill="url(#fillNom)" />
                                                <Area type="monotone" dataKey="real" name="Real (inflation‑adjusted)" stroke="hsl(var(--secondary))" fill="url(#fillReal)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="overflow-x-auto border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Metric</TableHead>
                                                    <TableHead className="text-right">Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Initial amount</TableCell>
                                                    <TableCell className="text-right">{fmt(Number(principalInput || 0), currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Interest earned (after tax)</TableCell>
                                                    <TableCell className="text-right">{fmt(results.interestAfterTax, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Inflation‑adjusted future value</TableCell>
                                                    <TableCell className="text-right">{fmt(results.realFV, currency)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground py-16">
                                    Enter your inputs and click <b>Calculate</b> to see totals and the growth curve.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Wrapper>
    );
}

function KPI({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
    );
}
