"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar,
} from "recharts";

// ---------------- Types ----------------
type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

// ---------------- Utils ----------------
const fmt = (n: number, cur: Currency): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: cur,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))"];

// ---------------- Page -----------------
export default function CommissionCalculator(): JSX.Element {
    const [currency, setCurrency] = useState<Currency>("USD");
    const [priceInput, setPriceInput] = useState<string>("");
    const [rateInput, setRateInput] = useState<string>(""); // % (optional)
    const [commissionInput, setCommissionInput] = useState<string>(""); // absolute (optional)

    const [results, setResults] = useState<
        | null
        | {
            price: number;
            ratePct: number; // computed
            commission: number; // computed
            netProceeds: number;
        }
    >(null);

    const onCalculate = (): void => {
        if (priceInput === "") {
            toast.error("Enter a sales price.");
            return;
        }
        const price = Number(priceInput);
        const ratePctRaw = rateInput.trim() === "" ? null : Number(rateInput);
        const commissionRaw = commissionInput.trim() === "" ? null : Number(commissionInput);

        if (!Number.isFinite(price) || price <= 0) {
            toast.error("Sales price must be greater than 0.");
            return;
        }
        if (ratePctRaw != null && (!Number.isFinite(ratePctRaw) || ratePctRaw < 0)) {
            toast.error("Commission rate cannot be negative.");
            return;
        }
        if (commissionRaw != null && (!Number.isFinite(commissionRaw) || commissionRaw < 0)) {
            toast.error("Commission amount cannot be negative.");
            return;
        }

        if (ratePctRaw == null && commissionRaw == null) {
            toast.error("Provide either a commission rate (%) or a commission amount ($).");
            return;
        }

        let ratePct: number;
        let commission: number;
        if (ratePctRaw != null && commissionRaw == null) {
            ratePct = ratePctRaw;
            commission = (ratePct / 100) * price;
        } else if (ratePctRaw == null && commissionRaw != null) {
            commission = commissionRaw;
            ratePct = (commission / price) * 100;
        } else {
            // both provided -> validate consistency
            const expected = (ratePctRaw! / 100) * price;
            const diff = Math.abs(expected - commissionRaw!);
            if (diff > Math.max(1e-6 * price, 0.01)) {
                toast.error("Rate and commission do not match the sale price.");
                return;
            }
            ratePct = ratePctRaw!;
            commission = commissionRaw!;
        }

        if (commission > price) {
            toast.error("Commission cannot exceed the sales price.");
            return;
        }

        const netProceeds = price - commission;
        setResults({ price, ratePct, commission, netProceeds });
    };

    const onClear = (): void => {
        setPriceInput("");
        setRateInput("");
        setCommissionInput("");
        setResults(null);
    };

    const pieData = useMemo(() => {
        if (!results) return [] as Array<{ name: string; value: number }>;
        return [
            { name: "Commission", value: results.commission },
            { name: "Seller proceeds", value: results.netProceeds },
        ];
    }, [results]);

    const barData = useMemo(() => {
        if (!results) return [] as Array<{ name: string; amount: number }>;
        return [
            { name: "Sale price", amount: results.price },
            { name: "Commission", amount: results.commission },
            { name: "Net proceeds", amount: results.netProceeds },
        ];
    }, [results]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-4xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Commission Calculator</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Compute commission by rate or amount, and visualize the split.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-2 sm:col-span-1">
                                <Label>Currency</Label>
                                <Select value={currency} onValueChange={(v: Currency) => setCurrency(v)}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD $</SelectItem>
                                        <SelectItem value="EUR">EUR €</SelectItem>
                                        <SelectItem value="GBP">GBP £</SelectItem>
                                        <SelectItem value="CAD">CAD $</SelectItem>
                                        <SelectItem value="AUD">AUD $</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Sales price</Label>
                                <Input type="number" placeholder="e.g. 200000" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label>Commission rate</Label>
                                <div className="flex items-center gap-3">
                                    <Input type="number" placeholder="e.g. 3" value={rateInput} onChange={(e) => setRateInput(e.target.value)} />
                                    <div className="px-3 py-2 rounded-md border text-sm">%</div>
                                </div>
                                <div className="text-xs text-muted-foreground">Optional if you enter a commission amount.</div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Commission amount</Label>
                                <Input type="number" placeholder="or enter amount" value={commissionInput} onChange={(e) => setCommissionInput(e.target.value)} />
                                <div className="text-xs text-muted-foreground">Optional if you enter a rate. Provide exactly one, or both if they match.</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <Button onClick={onCalculate}>Calculate</Button>
                            <Button variant="secondary" onClick={onClear}>Clear</Button>
                        </div>

                        <Separator className="my-2" />

                        {results ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <KPI label="Commission" value={fmt(results.commission, currency)} />
                                    <KPI label="Rate" value={`${results.ratePct.toFixed(3)}%`} />
                                    <KPI label="Net proceeds" value={fmt(results.netProceeds, currency)} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Donut */}
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                                                    {pieData.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(v: number | string) => (typeof v === "number" ? fmt(v, currency) : v)} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Bars */}
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(v: number) => fmt(v, currency)} width={90} />
                                                <Tooltip formatter={(v: number | string) => (typeof v === "number" ? fmt(v, currency) : v)} />
                                                <Bar dataKey="amount" name="Amount" fill="hsl(var(--primary))" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

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
                                                <TableCell>Sales price</TableCell>
                                                <TableCell className="text-right">{fmt(results.price, currency)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Commission</TableCell>
                                                <TableCell className="text-right">{fmt(results.commission, currency)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Net proceeds</TableCell>
                                                <TableCell className="text-right">{fmt(results.netProceeds, currency)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">Enter price and a rate <em>or</em> amount, then click <b>Calculate</b>.</div>
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
            <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
    );
}
