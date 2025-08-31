"use client";
import Wrapper from "@/app/Wrapper";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

// ---------------- Types ----------------
export type RangeKey = "1W" | "1M" | "6M" | "1Y" | "MAX";

// ---------------- Data -----------------
const CURRENCIES: ReadonlyArray<{ code: string; name: string; symbol: string }> = [
    { code: "USD", name: "United States Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "AUD", name: "Australian Dollar", symbol: "$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "$" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
] as const;

// -------------- Utils ------------------
const rangeToStart = (range: RangeKey): { start: string; end: string } => {
    const end = new Date();
    const d = new Date(end);
    switch (range) {
        case "1W":
            d.setDate(end.getDate() - 7);
            break;
        case "1M":
            d.setMonth(end.getMonth() - 1);
            break;
        case "6M":
            d.setMonth(end.getMonth() - 6);
            break;
        case "1Y":
            d.setFullYear(end.getFullYear() - 1);
            break;
        case "MAX":
            d.setFullYear(end.getFullYear() - 5);
            break; // 5y window for performance
    }
    const toISO = (x: Date) => x.toISOString().slice(0, 10);
    return { start: toISO(d), end: toISO(end) };
};

const nf = (n: number, currency?: string): string => {
    const value = Number.isFinite(n) ? n : 0;
    const opts: Intl.NumberFormatOptions = currency
        ? { style: "currency", currency, maximumFractionDigits: 4 }
        : { maximumFractionDigits: 6 };
    return new Intl.NumberFormat("en-US", opts).format(value);
};

// -------------- Page -------------------
export default function CurrencyConverterPage() {
    const [fromCode, setFromCode] = useState<string>("USD");
    const [toCode, setToCode] = useState<string>("EUR");
    const [amountInput, setAmountInput] = useState<string>("");
    const [range, setRange] = useState<RangeKey>("1W");

    const [latestRate, setLatestRate] = useState<number | null>(null);
    const [series, setSeries] = useState<Array<{ date: string; rate: number }> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const amountOut = useMemo<string>(() => {
        if (!latestRate) return "";
        if (amountInput === "") return "";
        const v = Number(amountInput);
        if (!Number.isFinite(v)) return "";
        return nf(v * latestRate);
    }, [amountInput, latestRate]);

    const oneUnitLine = useMemo<string | null>(() => {
        if (!latestRate) return null;
        return `1 ${fromCode} = ${nf(latestRate)} ${toCode}`;
    }, [latestRate, fromCode, toCode]);

    const fetchRates = async (): Promise<void> => {
        try {
            setLoading(true);
            setLatestRate(null);
            setSeries(null);

            const latestUrl = `https://api.frankfurter.app/latest?from=${fromCode}&to=${toCode}`;
            const latestRes = await fetch(latestUrl);
            if (!latestRes.ok) throw new Error("Failed to fetch latest rate");
            const latestJson: { rates: Record<string, number> } = await latestRes.json();
            const rate = latestJson?.rates?.[toCode];
            if (typeof rate !== "number") throw new Error("Rate not available for selected pair");
            setLatestRate(rate);

            const { start, end } = rangeToStart(range);
            const histUrl = `https://api.frankfurter.app/${start}..${end}?from=${fromCode}&to=${toCode}`;
            const histRes = await fetch(histUrl);
            if (!histRes.ok) throw new Error("Failed to fetch historical rates");
            const histJson: { rates: Record<string, Record<string, number>> } = await histRes.json();
            const points: Array<{ date: string; rate: number }> = Object.entries(histJson.rates || {})
                .map(([date, obj]) => ({ date, rate: obj[toCode] }))
                .sort((a, b) => a.date.localeCompare(b.date));
            setSeries(points);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Could not load rates. Try again.";
            console.error(err);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromCode, toCode, range]);

    const swap = (): void => {
        setFromCode(toCode);
        setToCode(fromCode);
    };

    const onConvertClick = (): void => {
        if (amountInput === "") {
            toast.error("Please enter an amount to convert.");
        }
    };

    const fromSymbol = CURRENCIES.find((c) => c.code === fromCode)?.symbol ?? "";
    const toSymbol = CURRENCIES.find((c) => c.code === toCode)?.symbol ?? "";

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-5xl">
                <div className="flex flex-col gap-2 text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Currency Converter</h1>
                    <p className="text-muted-foreground text-lg">Live ECB market rates with a clean shadcn UI and a responsive line chart.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left: controls */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Convert</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Amount</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={amountInput}
                                        onChange={(e) => setAmountInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") onConvertClick();
                                        }}
                                    />
                                    <Select value={fromCode} onValueChange={(val) => setFromCode(val)}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            {CURRENCIES.map((c) => (
                                                <SelectItem key={c.code} value={c.code}>
                                                    {c.code} – {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <Button variant="secondary" size="icon" onClick={swap} aria-label="Swap currencies">
                                    <ArrowLeftRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label>Converted to</Label>
                                <div className="flex gap-2">
                                    <Input readOnly placeholder="—" value={amountOut} />
                                    <Select value={toCode} onValueChange={(val) => setToCode(val)}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            {CURRENCIES.map((c) => (
                                                <SelectItem key={c.code} value={c.code}>
                                                    {c.code} – {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button onClick={onConvertClick}>Convert</Button>
                                <Button variant="outline" onClick={() => setAmountInput("")}>Clear</Button>
                                <Button variant="ghost" size="icon" onClick={fetchRates} aria-label="Refresh rates">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>

                            <Separator className="my-2" />

                            <div className="text-sm text-muted-foreground">{loading ? <Skeleton className="h-6 w-56" /> : oneUnitLine}</div>
                        </CardContent>
                    </Card>

                    {/* Right: chart & breakdown */}
                    <Card className="lg:col-span-3">
                        <CardHeader className="flex flex-col gap-2">
                            <CardTitle>Trends</CardTitle>
                            <ToggleGroup
                                type="single"
                                value={range}
                                onValueChange={(v: string) => v && setRange(v as RangeKey)}
                            >
                                <ToggleGroupItem value="1W">1W</ToggleGroupItem>
                                <ToggleGroupItem value="1M">1M</ToggleGroupItem>
                                <ToggleGroupItem value="6M">6M</ToggleGroupItem>
                                <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
                                <ToggleGroupItem value="MAX">Max</ToggleGroupItem>
                            </ToggleGroup>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                {loading || !series ? (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Skeleton className="h-10 w-3/4" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={series} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" minTickGap={24} />
                                            <YAxis tickFormatter={(v: number) => nf(v)} width={70} />
                                            <Tooltip
                                                formatter={(value: number | string) => nf(Number(value))}
                                                labelFormatter={(label: string) => new Date(label).toLocaleDateString()}
                                                contentStyle={{ borderRadius: 12 }}
                                            />
                                            <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            {!loading && latestRate && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                    <KPI label="1 unit price" value={`${fromSymbol}1 = ${nf(latestRate)} ${toCode}`} />
                                    <KPI label="Amount in" value={`${fromSymbol}${amountInput || 0} ${fromCode}`} />
                                    <KPI label="Amount out" value={`${toSymbol}${amountOut || 0} ${toCode}`} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Wrapper>
    );
}

function KPI({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-2xl border p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
    );
}