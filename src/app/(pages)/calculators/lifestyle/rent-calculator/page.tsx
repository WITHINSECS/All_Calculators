"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// ---------------- Types ----------------
type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";
type IncomePeriod = "year" | "month" | "week";

// ---------------- Utils ----------------
const fmt = (n: number, cur: Currency): string =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(
        Number.isFinite(n) ? n : 0
    );

const toMonthly = (amount: number, period: IncomePeriod): number => {
    if (period === "year") return amount / 12;
    if (period === "week") return (amount * 52) / 12;
    return amount; // month
};

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--muted-foreground))"];

// ---------------- Page -----------------
export default function RentCalculator(): JSX.Element {
    // Currency & income
    const [currency, setCurrency] = useState<Currency>("USD");
    const [incomeInput, setIncomeInput] = useState<string>("");
    const [period, setPeriod] = useState<IncomePeriod>("year");

    // Existing monthly debt
    const [debtInput, setDebtInput] = useState<string>("0");

    // Results
    const [results, setResults] = useState<
        | null
        | {
            monthlyIncome: number;
            rent25: number;
            rent30: number;
            rentDTI36: number;
            suggested: number;
            leftover: number;
        }
    >(null);

    const onCalculate = (): void => {
        if (incomeInput === "") {
            toast.error("Enter your pre‑tax income.");
            return;
        }
        const inc = Number(incomeInput);
        const debt = Number(debtInput || 0);
        if (!Number.isFinite(inc) || inc <= 0) { toast.error("Income must be greater than 0."); return; }
        if (!Number.isFinite(debt) || debt < 0) { toast.error("Debt must be zero or positive."); return; }

        const monthlyIncome = toMonthly(inc, period);

        // Rules
        const rent25 = 0.25 * monthlyIncome;
        const rent30 = 0.30 * monthlyIncome;
        const rentDTI36 = Math.max(0, 0.36 * monthlyIncome - debt); // total debt incl. rent <= 36% of income

        const suggested = Math.max(0, Math.min(rent30, rentDTI36));
        const leftover = Math.max(0, monthlyIncome - suggested - debt);

        setResults({ monthlyIncome, rent25, rent30, rentDTI36, suggested, leftover });
    };

    const onClear = (): void => {
        setIncomeInput("");
        setDebtInput("0");
        setResults(null);
    };

    const barData = useMemo(() => {
        if (!results) return [] as Array<{ name: string; value: number }>;
        return [
            { name: "25% rule", value: results.rent25 },
            { name: "30% rule", value: results.rent30 },
            { name: "DTI 36% cap", value: results.rentDTI36 },
            { name: "Suggested", value: results.suggested },
        ];
    }, [results]);

    const pieData = useMemo(() => {
        if (!results) return [] as Array<{ name: string; value: number }>;
        return [
            { name: "Rent", value: results.suggested },
            { name: "Debt", value: Number(debtInput || 0) },
            { name: "Leftover", value: Math.max(0, results.monthlyIncome - results.suggested - Number(debtInput || 0)) },
        ];
    }, [results, debtInput]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-6xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">How Much Rent Can I Afford?</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Estimate an affordable monthly rent from your income and debts.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inputs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Income */}
                            <div className="space-y-2">
                                <Label>Your pre‑tax income</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <Select value={currency} onValueChange={(v: Currency) => setCurrency(v)}>
                                        <SelectTrigger className="w-full sm:w-28"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD $</SelectItem>
                                            <SelectItem value="EUR">EUR €</SelectItem>
                                            <SelectItem value="GBP">GBP £</SelectItem>
                                            <SelectItem value="CAD">CAD $</SelectItem>
                                            <SelectItem value="AUD">AUD $</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input type="number" placeholder="e.g. 80000" value={incomeInput} onChange={(e) => setIncomeInput(e.target.value)} />
                                    <Select value={period} onValueChange={(v: IncomePeriod) => setPeriod(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="year">per year</SelectItem>
                                            <SelectItem value="month">per month</SelectItem>
                                            <SelectItem value="week">per week</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Debt */}
                            <div className="space-y-2">
                                <Label>Your monthly debt payback</Label>
                                <Input type="number" placeholder="e.g. 0" value={debtInput} onChange={(e) => setDebtInput(e.target.value)} />
                                <div className="text-xs text-muted-foreground">Include car/student loans, credit cards, etc.</div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <KPI label="Monthly income" value={fmt(results.monthlyIncome, currency)} />
                                        <KPI label="Suggested rent" value={fmt(results.suggested, currency)} />
                                        <KPI label="Leftover after rent & debt" value={fmt(results.leftover, currency)} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Bar chart */}
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={barData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis tickFormatter={(v: number) => fmt(v, currency)} width={90} />
                                                    <Tooltip formatter={(v: number | string) => (typeof v === "number" ? fmt(v, currency) : v)} />
                                                    <Legend />
                                                    <Bar dataKey="value" name="Monthly rent" fill="hsl(var(--primary))" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Pie chart */}
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                                                        {pieData.map((_, i) => (
                                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(v: number | string) => (typeof v === "number" ? fmt(v, currency) : v)} />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Rule</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Conservative (25% of income)</TableCell>
                                                    <TableCell className="text-right">{fmt(results.rent25, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Standard (30% of income)</TableCell>
                                                    <TableCell className="text-right">{fmt(results.rent30, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>DTI cap (36% incl. debts)</TableCell>
                                                    <TableCell className="text-right">{fmt(results.rentDTI36, currency)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground py-16">Enter your income and debts, then click <b>Calculate</b>.</div>
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
