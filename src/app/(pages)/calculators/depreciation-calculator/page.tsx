"use client";
import Wrapper from "@/app/Wrapper";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

// Helper: currency formatting (USD by default)
const formatCurrency = (n: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

// Types
type Method = "SL" | "DDB" | "SYD";

type Row = {
    year: number;
    label: string; // e.g., "Y1" or "Y1 (9 mo)"
    months: number;
    depreciation: number;
    accumulated: number;
    bookValue: number; // ending BV after this period
};

export default function DepreciationCalculator() {
    const [method, setMethod] = useState<Method>("SL");
    const [costInput, setCostInput] = useState<string>("");
    const [salvageInput, setSalvageInput] = useState<string>("");
    const [yearsInput, setYearsInput] = useState<string>("");
    const [roundToDollars, setRoundToDollars] = useState<"yes" | "no">("no");
    const [partialYear, setPartialYear] = useState<"yes" | "no">("no");
    const [firstYearMonths, setFirstYearMonths] = useState<string>("12");
    const [currency, setCurrency] = useState<string>("USD");

    const [schedule, setSchedule] = useState<Row[] | null>(null);

    const round = (n: number) => (roundToDollars === "yes" ? Math.round(n) : n);

    const validate = () => {
        if (costInput === "" || salvageInput === "" || yearsInput === "") {
            toast.error("Please fill cost, salvage and years.");
            return null;
        }
        const cost = Number(costInput);
        const salvage = Number(salvageInput);
        const years = Math.floor(Number(yearsInput));
        if (!Number.isFinite(cost) || cost <= 0) {
            toast.error("Asset cost must be a number greater than 0.");
            return null;
        }
        if (!Number.isFinite(salvage) || salvage < 0) {
            toast.error("Salvage value cannot be negative.");
            return null;
        }
        if (salvage >= cost) {
            toast.error("Salvage must be less than cost.");
            return null;
        }
        if (!Number.isFinite(years) || years < 1) {
            toast.error("Depreciation years must be at least 1.");
            return null;
        }
        let months = 12;
        if (partialYear === "yes") {
            if (firstYearMonths === "") {
                toast.error("Enter months in service for the first year.");
                return null;
            }
            months = Math.floor(Number(firstYearMonths));
            if (!Number.isFinite(months) || months < 1 || months > 12) {
                toast.error("First year months must be between 1 and 12.");
                return null;
            }
        }
        return { cost, salvage, years, months } as const;
    };

    const onCalculate = () => {
        const v = validate();
        if (!v) return;
        const { cost, salvage, years, months } = v;

        const base = cost - salvage;
        const rows: Row[] = [];
        let acc = 0;
        let bvStart = cost;

        const pushRow = (y: number, m: number, dep: number) => {
            const d = round(Math.min(dep, bvStart - salvage));
            acc = round(acc + d);
            const endBV = round(bvStart - d);
            const label = `Y${y}${m !== 12 ? ` (${m} mo)` : ""}`;
            rows.push({ year: y, label, months: m, depreciation: d, accumulated: acc, bookValue: endBV });
            bvStart = endBV;
        };

        if (method === "SL") {
            const annual = base / years;
            const firstDep = partialYear === "yes" ? (annual * months) / 12 : annual;
            pushRow(1, partialYear === "yes" ? months : 12, firstDep);
            for (let y = 2; y <= years; y++) {
                const isLast = y === years;
                const dep = isLast ? bvStart - salvage : annual; // adjust last year to hit salvage
                pushRow(y, 12, dep);
            }
        }

        if (method === "DDB") {
            const rate = 2 / years; // double-declining balance
            const firstFactor = partialYear === "yes" ? months / 12 : 1;
            // First year (possibly partial)
            pushRow(1, partialYear === "yes" ? months : 12, bvStart * rate * firstFactor);
            for (let y = 2; y <= years; y++) {
                const isLast = y === years;
                const dep = isLast ? bvStart - salvage : bvStart * rate;
                pushRow(y, 12, dep);
            }
        }

        if (method === "SYD") {
            const sum = (years * (years + 1)) / 2;
            // First year (possibly partial)
            const firstFactorNumerator = years; // remaining life at first year start
            const firstBase = base * (firstFactorNumerator / sum);
            const firstDep = partialYear === "yes" ? (firstBase * months) / 12 : firstBase;
            pushRow(1, partialYear === "yes" ? months : 12, firstDep);
            // Remaining full years
            for (let y = 2; y <= years; y++) {
                const remaining = years - y + 1;
                const isLast = y === years;
                const dep = isLast ? bvStart - salvage : base * (remaining / sum);
                pushRow(y, 12, dep);
            }
        }

        // Safety: ensure final BV equals salvage (numerical drift)
        if (rows.length) {
            const delta = round(rows[rows.length - 1].bookValue - salvage);
            if (Math.abs(delta) > 0.001) {
                const adjust = rows[rows.length - 1].depreciation + delta; // delta is signed
                rows[rows.length - 1].depreciation = round(adjust);
                rows[rows.length - 1].accumulated = round(rows[rows.length - 2]?.accumulated ?? 0) + round(adjust);
                rows[rows.length - 1].bookValue = round(rows[rows.length - 2]?.bookValue ?? cost) - round(adjust);
            }
        }

        setSchedule(rows);
    };

    const chartData = useMemo(() => {
        if (!schedule) return [] as { name: string; bookValue: number; depreciation: number }[];
        return schedule.map((r) => ({ name: r.label, bookValue: r.bookValue, depreciation: r.depreciation }));
    }, [schedule]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-4xl text-center">
                <h1 className="text-2xl font-semibold lg:text-4xl">Depreciation Calculator</h1>
                <p className="text-muted-foreground mt-4 text-lg">Beautiful shadcn UI with charts and a detailed schedule.</p>
            </div>

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:mb-20 mb-10">
                {/* Inputs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Method */}
                            <div className="space-y-2">
                                <Label>Depreciation method</Label>
                                <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SL">Straight Line</SelectItem>
                                        <SelectItem value="DDB">Declining Balance (Double)</SelectItem>
                                        <SelectItem value="SYD">Sum of the Years Digits</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Cost */}
                            <div className="space-y-2">
                                <Label>Asset cost</Label>
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
                                        placeholder="e.g. 11000"
                                        value={costInput}
                                        onChange={(e) => setCostInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Salvage */}
                            <div className="space-y-2">
                                <Label>Salvage value</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 1000"
                                    value={salvageInput}
                                    onChange={(e) => setSalvageInput(e.target.value)}
                                />
                            </div>

                            {/* Years */}
                            <div className="space-y-2">
                                <Label>Depreciation years</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={yearsInput}
                                    onChange={(e) => setYearsInput(e.target.value)}
                                />
                            </div>

                            {/* Round? */}
                            <div className="space-y-2">
                                <Label>Round to dollars?</Label>
                                <RadioGroup
                                    className="flex gap-6"
                                    value={roundToDollars}
                                    onValueChange={(v) => setRoundToDollars(v as "yes" | "no")}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="r-yes" />
                                        <Label htmlFor="r-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="r-no" />
                                        <Label htmlFor="r-no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Partial year? */}
                            <div className="space-y-2">
                                <Label>Partial year depreciation?</Label>
                                <RadioGroup
                                    className="flex gap-6"
                                    value={partialYear}
                                    onValueChange={(v) => setPartialYear(v as "yes" | "no")}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="p-yes" />
                                        <Label htmlFor="p-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="p-no" />
                                        <Label htmlFor="p-no">No</Label>
                                    </div>
                                </RadioGroup>
                                {partialYear === "yes" && (
                                    <div className="flex items-center gap-3">
                                        <Label className="w-48">Months in first year</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 9"
                                            value={firstYearMonths}
                                            onChange={(e) => setFirstYearMonths(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <Button className="w-full md:w-auto" onClick={onCalculate}>Calculate</Button>
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
                        {schedule ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <KPI label="Cost" value={formatCurrency(Number(costInput), currency)} />
                                    <KPI label="Salvage" value={formatCurrency(Number(salvageInput), currency)} />
                                    <KPI
                                        label="Total Depreciation"
                                        value={formatCurrency(Math.max(0, Number(costInput) - Number(salvageInput)), currency)}
                                    />
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsla(var(--primary), 0.6)" />
                                                    <stop offset="95%" stopColor="hsla(var(--primary), 0.1)" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" className="text-muted" />
                                            <XAxis dataKey="name" />
                                            <YAxis tickFormatter={(v) => formatCurrency(v, currency)} width={80} />
                                            <Tooltip
                                                formatter={(value) => [formatCurrency(Number(value), currency), "Book Value"]}
                                                contentStyle={{ borderRadius: 12 }}
                                            />
                                            <Area type="monotone" dataKey="bookValue" stroke="hsl(var(--primary))" fill="url(#fillPrimary)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="overflow-x-auto border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Year</TableHead>
                                                <TableHead>Months</TableHead>
                                                <TableHead>Depreciation</TableHead>
                                                <TableHead>Accumulated</TableHead>
                                                <TableHead>Ending Book Value</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schedule.map((r) => (
                                                <TableRow key={r.label}>
                                                    <TableCell className="font-medium">{r.label}</TableCell>
                                                    <TableCell>{r.months}</TableCell>
                                                    <TableCell>{formatCurrency(r.depreciation, currency)}</TableCell>
                                                    <TableCell>{formatCurrency(r.accumulated, currency)}</TableCell>
                                                    <TableCell>{formatCurrency(r.bookValue, currency)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground py-16">
                                Enter inputs and click <b>Calculate</b> to see results.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}

function KPI({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
    );
}
