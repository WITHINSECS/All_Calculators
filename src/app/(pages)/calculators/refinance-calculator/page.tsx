"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
} from "recharts";

// ---------------- Types ----------------
type Mode = "balance" | "original";
type RollCosts = "yes" | "no";

interface CurrentResults {
    payment: number;
    monthsLeft: number;
    interestRemaining: number;
}

interface RefiResults {
    principal: number; // amount financed
    payment: number;
    interestTotal: number;
    closingCosts: number;
    monthlySavings: number;
    breakEvenMonths: number | null;
    interestSavings: number;
    totalSavingsNet: number;
}

interface CalcResults {
    current: CurrentResults;
    refi: RefiResults;
}

// ---------------- Utils ----------------
const fmt = (n: number, cur: string = "USD"): string => {
    const value = Number.isFinite(n) ? n : 0;
    const opts: Intl.NumberFormatOptions = { style: "currency", currency: cur, maximumFractionDigits: 2 };
    return new Intl.NumberFormat("en-US", opts).format(value);
};

const monthsToYears = (m: number): string => `${(m / 12).toFixed(2)} yrs`;

// -------------- Component --------------
export default function RefinanceCalculator(): JSX.Element {
    // Display currency (formatting only)
    const [currency, setCurrency] = useState<string>("USD");

    // Current loan mode
    const [mode, setMode] = useState<Mode>("balance");

    // Mode A: Known remaining balance
    const [curBalance, setCurBalance] = useState<string>("");
    const [curPayment, setCurPayment] = useState<string>("");
    const [curRate, setCurRate] = useState<string>(""); // APR %

    // Mode B: Original loan known
    const [origAmount, setOrigAmount] = useState<string>("");
    const [origYears, setOrigYears] = useState<string>("");
    const [monthsPaid, setMonthsPaid] = useState<string>(""); // months already paid
    // curRate is reused for APR

    // New loan
    const [newYears, setNewYears] = useState<string>("");
    const [newRate, setNewRate] = useState<string>("");
    const [pointsPct, setPointsPct] = useState<string>("0");
    const [fees, setFees] = useState<string>("0");
    const [cashOut, setCashOut] = useState<string>("0");
    const [rollCosts, setRollCosts] = useState<RollCosts>("no");

    const [results, setResults] = useState<CalcResults | null>(null);

    // ----------- Calculations ------------
    const onCalculate = (): void => {
        try {
            let balance: number; // remaining balance to refinance
            let payment: number; // current monthly payment
            let rateAPR: number; // current APR
            let monthsLeft: number; // months remaining on current loan

            if (mode === "balance") {
                if (curBalance === "" || curPayment === "" || curRate === "") {
                    toast.error("Please fill Remaining balance, Monthly payment and Interest rate.");
                    return;
                }
                balance = Number(curBalance);
                payment = Number(curPayment);
                rateAPR = Number(curRate);
                if (!Number.isFinite(balance) || balance <= 0) { toast.error("Remaining balance must be > 0."); return; }
                if (!Number.isFinite(payment) || payment <= 0) { toast.error("Monthly payment must be > 0."); return; }
                if (!Number.isFinite(rateAPR) || rateAPR < 0) { toast.error("Interest rate cannot be negative."); return; }

                const r = rateAPR / 100 / 12;
                if (r === 0) {
                    monthsLeft = balance / payment;
                } else {
                    if (payment <= r * balance) { toast.error("Payment is too low to amortize this balance."); return; }
                    monthsLeft = -Math.log(1 - (r * balance) / payment) / Math.log(1 + r);
                }
            } else {
                // mode === "original"
                if (origAmount === "" || origYears === "" || curRate === "" || monthsPaid === "") {
                    toast.error("Please fill original amount, term, rate and months already paid.");
                    return;
                }
                const A = Number(origAmount);
                const Y = Math.floor(Number(origYears));
                const k = Math.floor(Number(monthsPaid));
                rateAPR = Number(curRate);
                if (!Number.isFinite(A) || A <= 0) { toast.error("Original amount must be > 0."); return; }
                if (!Number.isFinite(Y) || Y <= 0) { toast.error("Original term must be > 0."); return; }
                if (!Number.isFinite(k) || k < 0) { toast.error("Months paid cannot be negative."); return; }
                if (k >= Y * 12) { toast.error("Months paid cannot exceed total original months."); return; }
                if (!Number.isFinite(rateAPR) || rateAPR < 0) { toast.error("Interest rate cannot be negative."); return; }

                const r = rateAPR / 100 / 12;
                const N = Y * 12;
                let P: number;
                if (r === 0) {
                    P = A / N;
                    balance = Math.max(0, A - P * k);
                } else {
                    const powN = Math.pow(1 + r, N);
                    P = (A * r * powN) / (powN - 1);
                    const powK = Math.pow(1 + r, k);
                    balance = A * powK - (P * (powK - 1)) / r;
                }
                payment = P;
                monthsLeft = Math.max(0, N - k);
            }

            // Current path interest remaining
            const totalPaidRemaining = payment * monthsLeft; // allows fractional months
            const interestRemaining = Math.max(0, totalPaidRemaining - balance);

            // New loan inputs
            if (newYears === "" || newRate === "") { toast.error("Please fill new loan term and new interest rate."); return; }
            const nYears = Number(newYears);
            const rateNewAPR = Number(newRate);
            const points = Number(pointsPct || 0);
            const feesNum = Number(fees || 0);
            const cashOutNum = Number(cashOut || 0);
            if (!Number.isFinite(nYears) || nYears <= 0) { toast.error("New loan term must be > 0 years."); return; }
            if (!Number.isFinite(rateNewAPR) || rateNewAPR < 0) { toast.error("New interest rate cannot be negative."); return; }
            if (points < 0) { toast.error("Points cannot be negative."); return; }
            if (feesNum < 0) { toast.error("Costs & fees cannot be negative."); return; }
            if (cashOutNum < 0) { toast.error("Cash out cannot be negative."); return; }

            const basePrincipal = balance + cashOutNum;
            const pointsCost = (points / 100) * basePrincipal;
            const closingCosts = pointsCost + feesNum;
            const principalFinanced = rollCosts === "yes" ? basePrincipal + closingCosts : basePrincipal;

            const rNew = rateNewAPR / 100 / 12;
            const Nnew = nYears * 12;
            let newPayment: number;
            if (rNew === 0) {
                newPayment = principalFinanced / Nnew;
            } else {
                const pow = Math.pow(1 + rNew, Nnew);
                newPayment = (principalFinanced * rNew * pow) / (pow - 1);
            }

            const totalPaidNew = newPayment * Nnew;
            const interestNew = Math.max(0, totalPaidNew - principalFinanced);

            const monthlySavings = payment - newPayment;
            const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : null;
            const interestSavings = interestRemaining - interestNew;
            const totalSavingsNet = interestSavings - closingCosts;

            const payload: CalcResults = {
                current: { payment, monthsLeft, interestRemaining },
                refi: {
                    principal: principalFinanced,
                    payment: newPayment,
                    interestTotal: interestNew,
                    closingCosts,
                    monthlySavings,
                    breakEvenMonths,
                    interestSavings,
                    totalSavingsNet,
                },
            };
            setResults(payload);
        } catch (e) {
            // Shouldn't hit if all branches validate
            const msg = e instanceof Error ? e.message : "Something went wrong.";
            toast.error(msg);
        }
    };

    const onClear = (): void => {
        setCurBalance("");
        setCurPayment("");
        setCurRate("");
        setOrigAmount("");
        setOrigYears("");
        setMonthsPaid("");
        setNewYears("");
        setNewRate("");
        setPointsPct("0");
        setFees("0");
        setCashOut("0");
        setRollCosts("no");
        setResults(null);
    };

    const chartData = useMemo((): Array<{ name: string; Interest: number; Closing: number }> => {
        if (!results) return [];
        return [
            { name: "Current path", Interest: results.current.interestRemaining, Closing: 0 },
            { name: "Refinance", Interest: results.refi.interestTotal, Closing: results.refi.closingCosts },
        ];
    }, [results]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-6xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Refinance Calculator</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Plan your refinance and compare payments, interest, and break‑even.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:mb-20 mb-10">
                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inputs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Currency */}
                                <div className="space-y-2">
                                    <Label>Display currency</Label>
                                    <Select value={currency} onValueChange={(val: string) => setCurrency(val)}>
                                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD $</SelectItem>
                                            <SelectItem value="INR">INR ₹</SelectItem>
                                            <SelectItem value="PKR">PKR ₨</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Mode Selector */}
                                <div className="space-y-2">
                                    <Label>Current loan</Label>
                                    <Select value={mode} onValueChange={(v: string) => setMode(v === "original" ? "original" : "balance")}>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="balance">I know my remaining balance</SelectItem>
                                            <SelectItem value="original">I know the original loan amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {mode === "balance" ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label>Remaining balance</Label>
                                            <Input type="number" value={curBalance} onChange={(e) => setCurBalance(e.target.value)} placeholder="e.g. 250000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Monthly payment</Label>
                                            <Input type="number" value={curPayment} onChange={(e) => setCurPayment(e.target.value)} placeholder="e.g. 1800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Interest rate (APR)</Label>
                                            <div className="flex gap-3">
                                                <Input type="number" value={curRate} onChange={(e) => setCurRate(e.target.value)} placeholder="e.g. 7" />
                                                <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label>Original loan amount</Label>
                                            <Input type="number" value={origAmount} onChange={(e) => setOrigAmount(e.target.value)} placeholder="e.g. 300000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Original loan term (years)</Label>
                                            <Input type="number" value={origYears} onChange={(e) => setOrigYears(e.target.value)} placeholder="e.g. 30" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Interest rate (APR)</Label>
                                            <div className="flex gap-3">
                                                <Input type="number" value={curRate} onChange={(e) => setCurRate(e.target.value)} placeholder="e.g. 7" />
                                                <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Months already paid</Label>
                                            <Input type="number" value={monthsPaid} onChange={(e) => setMonthsPaid(e.target.value)} placeholder="e.g. 60" />
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                {/* New Loan */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label>New loan term</Label>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" value={newYears} onChange={(e) => setNewYears(e.target.value)} placeholder="e.g. 20" />
                                            <div className="text-sm text-muted-foreground">years</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Interest rate (APR)</Label>
                                        <div className="flex gap-3">
                                            <Input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} placeholder="e.g. 6" />
                                            <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Points</Label>
                                        <div className="flex gap-3">
                                            <Input type="number" value={pointsPct} onChange={(e) => setPointsPct(e.target.value)} placeholder="e.g. 2" />
                                            <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Costs & fees</Label>
                                        <Input type="number" value={fees} onChange={(e) => setFees(e.target.value)} placeholder="e.g. 1500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cash out amount</Label>
                                        <Input type="number" value={cashOut} onChange={(e) => setCashOut(e.target.value)} placeholder="e.g. 0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Include closing costs in loan?</Label>
                                        <RadioGroup className="flex gap-6" value={rollCosts} onValueChange={(v: string) => setRollCosts(v === "yes" ? "yes" : "no")}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="yes" id="rc-yes" />
                                                <Label htmlFor="rc-yes">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id="rc-no" />
                                                <Label htmlFor="rc-no">No</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <Button onClick={onCalculate}>Calculate</Button>
                                        <Button variant="secondary" onClick={onClear}>Clear</Button>
                                    </div>
                                </div>
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
                                    {/* Top figures */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <KPI label="Current payment" value={fmt(results.current.payment, currency)} />
                                        <KPI label="New payment" value={fmt(results.refi.payment, currency)} />
                                        <KPI
                                            label="Monthly savings"
                                            value={`${results.refi.monthlySavings >= 0 ? "" : "-"}${fmt(Math.abs(results.refi.monthlySavings), currency)}`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <KPI label="Months left (current)" value={results.current.monthsLeft.toFixed(1)} />
                                        <KPI label="Interest remaining (current)" value={fmt(results.current.interestRemaining, currency)} />
                                        <KPI label="Closing costs" value={fmt(results.refi.closingCosts, currency)} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <KPI label="Interest (new loan)" value={fmt(results.refi.interestTotal, currency)} />
                                        <KPI label="Interest savings" value={fmt(results.refi.interestSavings, currency)} />
                                        <KPI
                                            label="Break-even"
                                            value={
                                                results.refi.breakEvenMonths ? `${results.refi.breakEvenMonths.toFixed(1)} mo (${monthsToYears(results.refi.breakEvenMonths)})` : "—"
                                            }
                                        />
                                    </div>

                                    {/* Chart */}
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(v: number) => fmt(v, currency)} width={90} />
                                                <Tooltip formatter={(v: number | string) => fmt(Number(v), currency)} />
                                                <Legend />
                                                <Bar dataKey="Interest" stackId="a" fill="hsl(var(--primary))" />
                                                <Bar dataKey="Closing" stackId="a" fill="hsl(var(--secondary))" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Breakdown Table */}
                                    <div className="overflow-x-auto border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Item</TableHead>
                                                    <TableHead className="text-right">Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Amount financed (new)</TableCell>
                                                    <TableCell className="text-right">{fmt(results.refi.principal, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total interest (current path)</TableCell>
                                                    <TableCell className="text-right">{fmt(results.current.interestRemaining, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total interest (new)</TableCell>
                                                    <TableCell className="text-right">{fmt(results.refi.interestTotal, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total savings net of closing costs</TableCell>
                                                    <TableCell className="text-right">{fmt(results.refi.totalSavingsNet, currency)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground py-16">
                                    Enter your current and new loan details, then click <b>Calculate</b>.
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
