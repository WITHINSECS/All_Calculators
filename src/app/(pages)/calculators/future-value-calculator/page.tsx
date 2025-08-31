"use client";
import Wrapper from "@/app/Wrapper";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

// Use shadcn theme tokens so colors follow your theme
const CHART_COLORS = [
    "hsl(var(--primary))",      // Starting amount
    "hsl(var(--secondary))",    // Periodic deposits
    "hsl(var(--destructive))",  // Interest
];

type Timing = "beginning" | "end"; // PMT timing

const formatCurrency = (n: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

export default function FutureValueCalculator() {
    // Raw string inputs so fields can be blank until Calculate.
    const [periodsInput, setPeriodsInput] = useState<string>("");
    const [pvInput, setPvInput] = useState<string>("");
    const [rateInput, setRateInput] = useState<string>(""); // percent per period
    const [pmtInput, setPmtInput] = useState<string>("");
    const [timing, setTiming] = useState<Timing>("end");
    const [currency, setCurrency] = useState<string>("USD");

    const [result, setResult] = useState<
        | null
        | {
            fv: number;
            totalDeposits: number; // PV + PMT*N
            interest: number; // fv - totalDeposits
        }
    >(null);

    const validate = () => {
        if (periodsInput === "" || pvInput === "" || rateInput === "" || pmtInput === "") {
            toast.error("Please fill all fields before calculating.");
            return null;
        }
        const n = Math.floor(Number(periodsInput));
        const pv = Number(pvInput);
        const ratePct = Number(rateInput);
        const pmt = Number(pmtInput);

        if (!Number.isFinite(n) || n <= 0) {
            toast.error("Number of periods must be a whole number greater than 0.");
            return null;
        }
        if (!Number.isFinite(pv) || pv < 0) {
            toast.error("Starting amount (PV) cannot be negative.");
            return null;
        }
        if (!Number.isFinite(ratePct) || ratePct < 0) {
            toast.error("Interest rate cannot be negative.");
            return null;
        }
        if (!Number.isFinite(pmt) || pmt < 0) {
            toast.error("Periodic deposit (PMT) cannot be negative.");
            return null;
        }

        return { n, pv, ratePct, pmt } as const;
    };

    const onCalculate = () => {
        const v = validate();
        if (!v) return;
        const { n, pv, ratePct, pmt } = v;

        const r = ratePct / 100; // per period

        let fvPV = 0;
        let fvPMT = 0;

        if (r === 0) {
            fvPV = pv; // no growth
            fvPMT = pmt * n; // simple sum
        } else {
            const pow = Math.pow(1 + r, n);
            fvPV = pv * pow;
            const ann = ((pow - 1) / r) * pmt; // ordinary annuity (end)
            fvPMT = timing === "end" ? ann : ann * (1 + r); // annuity due adjustment
        }

        const fv = fvPV + fvPMT;
        const totalDeposits = pv + pmt * n;
        const interest = Math.max(0, fv - totalDeposits);

        setResult({ fv, totalDeposits, interest });
    };

    const onClear = () => {
        setPeriodsInput("");
        setPvInput("");
        setRateInput("");
        setPmtInput("");
        setTiming("end");
        setResult(null);
    };

    const pieData = useMemo(() => {
        if (!result) return [] as { name: string; value: number }[];
        return [
            { name: "Starting amount", value: Number(pvInput) || 0 },
            { name: "Periodic deposits", value: (Number(pmtInput) || 0) * (Number(periodsInput) || 0) },
            { name: "Interest", value: result.interest },
        ];
    }, [result, pvInput, pmtInput, periodsInput]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-4xl text-center">
                <h1 className="text-2xl font-semibold lg:text-4xl">Future Value Calculator</h1>
                <p className="text-muted-foreground mt-4 text-lg">Compute the future value of a starting amount with periodic deposits. Clean shadcn UI + beautiful chart.</p>
            </div>

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:mb-20 mb-10">
                {/* Inputs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Number of periods */}
                            <div className="space-y-2">
                                <Label>Number of Periods (N)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 10"
                                    value={periodsInput}
                                    onChange={(e) => setPeriodsInput(e.target.value)}
                                />
                            </div>

                            {/* Starting Amount (PV) */}
                            <div className="space-y-2">
                                <Label>Starting Amount (PV)</Label>
                                <div className="flex items-center gap-3">
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD $</SelectItem>
                                            <SelectItem value="INR">INR ₹</SelectItem>
                                            <SelectItem value="PKR">PKR ₨</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 1000"
                                        value={pvInput}
                                        onChange={(e) => setPvInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Interest Rate */}
                            <div className="space-y-2">
                                <Label>Interest Rate (I/Y)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        placeholder="e.g. 6"
                                        value={rateInput}
                                        onChange={(e) => setRateInput(e.target.value)}
                                    />
                                    <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                </div>
                            </div>

                            {/* Periodic Deposit */}
                            <div className="space-y-2">
                                <Label>Periodic Deposit (PMT)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        placeholder="e.g. 100"
                                        value={pmtInput}
                                        onChange={(e) => setPmtInput(e.target.value)}
                                    />
                                    <div className="text-sm text-muted-foreground">/period</div>
                                </div>
                            </div>

                            {/* Timing */}
                            <div className="space-y-2">
                                <Label>PMT made at the</Label>
                                <RadioGroup
                                    className="flex gap-6"
                                    value={timing}
                                    onValueChange={(v) => setTiming(v as Timing)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="beginning" id="t-beg" />
                                        <Label htmlFor="t-beg">beginning</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="end" id="t-end" />
                                        <Label htmlFor="t-end">end</Label>
                                    </div>
                                    <div className="text-sm text-muted-foreground self-center">of each compound period</div>
                                </RadioGroup>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button onClick={onCalculate}>Calculate</Button>
                                <Button variant="secondary" onClick={onClear}>Clear</Button>
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
                        {result ? (
                            <>
                                <div>
                                    <div className="text-sm text-muted-foreground">Future Value</div>
                                    <div className="text-3xl font-bold text-primary">
                                        {formatCurrency(result.fv, currency)}
                                    </div>
                                </div>

                                <div className="overflow-x-auto border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Description</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Starting amount (PV)</TableCell>
                                                <TableCell className="text-right">{formatCurrency(Number(pvInput) || 0, currency)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total periodic deposits</TableCell>
                                                <TableCell className="text-right">{formatCurrency((Number(pmtInput) || 0) * (Number(periodsInput) || 0), currency)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total interest</TableCell>
                                                <TableCell className="text-right">{formatCurrency(result.interest, currency)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                                                {pieData.map((_, i) => (
                                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)
                                                )}
                                            </Pie>
                                            <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground py-16">
                                Enter inputs and click <b>Calculate</b> to see the future value and breakdown.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}
