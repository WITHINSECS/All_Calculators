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

// ---------------- Types ----------------
type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF";

type Compound = "annually" | "quarterly" | "monthly" | "daily";

// ---------------- Utils ----------------
const fmt = (n: number, currency: CurrencyCode): string =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(
        Number.isFinite(n) ? n : 0
    );

const compPerYear = (c: Compound): number => (c === "annually" ? 1 : c === "quarterly" ? 4 : c === "monthly" ? 12 : 365);

// ---------------- Page -----------------
export default function MaturityValueCalculator(): JSX.Element {
    // Currency & principal
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [principalInput, setPrincipalInput] = useState<string>("");

    // Rate & period
    const [rateInput, setRateInput] = useState<string>(""); // APR %
    const [compound, setCompound] = useState<Compound>("annually");
    const [yearsInput, setYearsInput] = useState<string>("");
    const [monthsInput, setMonthsInput] = useState<string>("");

    // Results
    const [maturity, setMaturity] = useState<number | null>(null);
    const [interestEarned, setInterestEarned] = useState<number | null>(null);

    const validate = () => {
        if (principalInput === "" || rateInput === "" || (yearsInput === "" && monthsInput === "")) {
            toast.error("Please enter principal, interest rate, and time of investment.");
            return null;
        }
        const P = Number(principalInput);
        const rPct = Number(rateInput);
        const years = Number(yearsInput || 0);
        const months = Number(monthsInput || 0);

        if (!Number.isFinite(P) || P <= 0) { toast.error("Principal must be greater than 0."); return null; }
        if (!Number.isFinite(rPct) || rPct < 0) { toast.error("Interest rate cannot be negative."); return null; }
        if (!Number.isFinite(years) || !Number.isFinite(months) || (years <= 0 && months <= 0)) { toast.error("Time of investment must be greater than 0."); return null; }

        return { P, rPct, years, months } as const;
    };

    const onCalculate = (): void => {
        const v = validate();
        if (!v) return;
        const { P, rPct, years, months } = v;

        const tYears = years + months / 12; // years, decimal
        const n = compPerYear(compound); // compounding periods per year
        const r = rPct / 100; // nominal APR

        // Compound interest maturity value
        const FV = P * Math.pow(1 + r / n, n * tYears);
        const interest = Math.max(0, FV - P);

        setMaturity(FV);
        setInterestEarned(interest);
    };

    const onClear = (): void => {
        setPrincipalInput("");
        setRateInput("");
        setYearsInput("");
        setMonthsInput("");
        setMaturity(null);
        setInterestEarned(null);
    };

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Maturity Value Calculator</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Compute the future value of your investment with popular currencies and flexible compounding.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Principal */}
                        <div className="space-y-2">
                            <Label>Principal</Label>
                            <div className="flex items-center gap-3">
                                <Select value={currency} onValueChange={(v: string) => setCurrency(v as CurrencyCode)}>
                                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD $</SelectItem>
                                        <SelectItem value="EUR">EUR €</SelectItem>
                                        <SelectItem value="GBP">GBP £</SelectItem>
                                        <SelectItem value="JPY">JPY ¥</SelectItem>
                                        <SelectItem value="AUD">AUD $</SelectItem>
                                        <SelectItem value="CAD">CAD $</SelectItem>
                                        <SelectItem value="CHF">CHF Fr.</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={principalInput}
                                    onChange={(e) => setPrincipalInput(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Rate */}
                        <div className="space-y-2">
                            <Label>Interest rate</Label>
                            <div className="flex items-center gap-3">
                                <Input type="number" placeholder="e.g. 6" value={rateInput} onChange={(e) => setRateInput(e.target.value)} />
                                <div className="px-3 py-2 rounded-md border text-sm">%</div>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="space-y-2">
                            <Label>Time of investment</Label>
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

                        {/* Compounding */}
                        <div className="space-y-2">
                            <Label>Compounding</Label>
                            <Select value={compound} onValueChange={(v: string) => setCompound(v as Compound)}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="annually">Annually</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <Button onClick={onCalculate}>Calculate</Button>
                            <Button variant="secondary" onClick={onClear}>Clear</Button>
                        </div>

                        <Separator />

                        {/* Results inline to match the screenshot vibe */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Maturity value</Label>
                                <Input readOnly placeholder={currency} value={maturity != null ? fmt(maturity, currency) : ""} />
                            </div>
                            <div className="space-y-2">
                                <Label>Total interest earned</Label>
                                <Input readOnly placeholder={currency} value={interestEarned != null ? fmt(interestEarned, currency) : ""} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}