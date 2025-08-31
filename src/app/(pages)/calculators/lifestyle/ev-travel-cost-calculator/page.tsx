"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
type Currency = "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD";

type FuelKind = "Petrol" | "Diesel";

interface Results {
    distanceKm: number;
    evCost: number;
    iceCost: number;
    savings: number; // ice - ev
    evKWhPer100: number;
    iceLPer100: number;
}

// ---------------- Utils ----------------
const fmtMoney = (n: number, cur: Currency) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 2 }).format(
        Number.isFinite(n) ? n : 0,
    );

// ---------------- Page -----------------
export default function EVTravelCostCalculator(): JSX.Element {
    // Currency
    const [currency, setCurrency] = useState<Currency>("USD");

    // EV inputs (strings so fields can be empty, sliders keep numeric mirrors)
    const [evRangeIn, setEvRangeIn] = useState<string>("200"); // km
    const [evRange, setEvRange] = useState<number>(200);

    const [batteryKWhIn, setBatteryKWhIn] = useState<string>("15");
    const [batteryKWh, setBatteryKWh] = useState<number>(15);

    const [distIn, setDistIn] = useState<string>("100");
    const [distanceKm, setDistanceKm] = useState<number>(100);

    const [pricePerKWhIn, setPricePerKWhIn] = useState<string>("0.12");
    const [pricePerKWh, setPricePerKWh] = useState<number>(0.12);

    // ICE inputs
    const [fuelKind, setFuelKind] = useState<FuelKind>("Petrol");
    const [fuelPriceIn, setFuelPriceIn] = useState<string>("4.00"); // per liter (default USD 4/L ~ 15.1/gal)
    const [fuelPrice, setFuelPrice] = useState<number>(4);
    const [mileageIn, setMileageIn] = useState<string>("10"); // km/litre
    const [mileageKmPerL, setMileageKmPerL] = useState<number>(10);

    const [results, setResults] = useState<Results | null>(null);

    // sync input boxes with sliders
    const syncNumber = (raw: string, setter: (n: number) => void) => {
        if (raw.trim() === "") return; // let it be empty visually; button will validate
        const v = Number(raw);
        if (!Number.isFinite(v)) return;
        setter(v);
    };

    const calculate = (): void => {
        // basic validation
        if (evRangeIn.trim() === "" || batteryKWhIn.trim() === "" || distIn.trim() === "" || pricePerKWhIn.trim() === ""
            || fuelPriceIn.trim() === "" || mileageIn.trim() === "") {
            toast.error("Please fill all sliders/inputs before calculating.");
            return;
        }

        const dist = Number(distIn);
        const range = Number(evRangeIn);
        const pack = Number(batteryKWhIn);
        const kwhPrice = Number(pricePerKWhIn);
        const kmPerL = Number(mileageIn);
        const fuelP = Number(fuelPriceIn);

        if ([dist, range, pack, kwhPrice, kmPerL, fuelP].some((x) => !Number.isFinite(x) || x <= 0)) {
            toast.error("All numeric values must be > 0.");
            return;
        }

        // EV consumption (kWh/km) and (kWh/100km)
        const kWhPerKm = pack / range;
        const kWhPer100 = kWhPerKm * 100;
        const evCost = dist * kWhPerKm * kwhPrice;

        // ICE consumption (L/100km)
        const LPerKm = 1 / kmPerL;
        const LPer100 = LPerKm * 100;
        const iceCost = dist * LPerKm * fuelP;

        setResults({ distanceKm: dist, evCost, iceCost, savings: Math.max(0, iceCost - evCost), evKWhPer100: kWhPer100, iceLPer100: LPer100 });
    };

    const clearAll = (): void => {
        setResults(null);
    };

    const barData = useMemo(() => {
        if (!results) return [] as Array<{ name: string; cost: number }>;
        return [
            { name: "EV", cost: results.evCost },
            { name: "Conventional", cost: results.iceCost },
            { name: "Savings", cost: results.savings },
        ];
    }, [results]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-12 p-5 mt-8 max-w-6xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">EV Travel Cost Calculator</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Compare electricity vs fuel cost for a given distance with default shadcn design.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column: Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inputs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="ev" className="w-full">
                                <TabsList className="grid grid-cols-2 w-full">
                                    <TabsTrigger value="ev">Electric Vehicle</TabsTrigger>
                                    <TabsTrigger value="ice">Conventional Vehicle</TabsTrigger>
                                </TabsList>
                                <TabsContent value="ev" className="space-y-5 pt-4">
                                    {/* EV Range */}
                                    <div className="space-y-2">
                                        <Label>EV Range</Label>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" className="w-28" value={evRangeIn} onChange={(e) => { setEvRangeIn(e.target.value); syncNumber(e.target.value, setEvRange); }} />
                                            <span className="text-sm text-muted-foreground">km</span>
                                        </div>
                                        <Slider value={[evRange]} onValueChange={(v) => { setEvRange(v[0]); setEvRangeIn(String(v[0])); }} min={50} max={900} step={10} />
                                        <div className="text-xs text-muted-foreground">Typical: 150–600 km</div>
                                    </div>

                                    {/* Battery capacity */}
                                    <div className="space-y-2">
                                        <Label>Battery Capacity</Label>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" className="w-28" value={batteryKWhIn} onChange={(e) => { setBatteryKWhIn(e.target.value); syncNumber(e.target.value, setBatteryKWh); }} />
                                            <span className="text-sm text-muted-foreground">kWh</span>
                                        </div>
                                        <Slider value={[batteryKWh]} onValueChange={(v) => { setBatteryKWh(v[0]); setBatteryKWhIn(String(v[0])); }} min={10} max={200} step={1} />
                                    </div>

                                    {/* Distance */}
                                    <div className="space-y-2">
                                        <Label>Distance to travel</Label>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" className="w-28" value={distIn} onChange={(e) => { setDistIn(e.target.value); syncNumber(e.target.value, setDistanceKm); }} />
                                            <span className="text-sm text-muted-foreground">km</span>
                                        </div>
                                        <Slider value={[distanceKm]} onValueChange={(v) => { setDistanceKm(v[0]); setDistIn(String(v[0])); }} min={10} max={10000} step={10} />
                                    </div>

                                    {/* Charging cost */}
                                    <div className="space-y-2">
                                        <Label>EV Charging Cost</Label>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" className="w-28" value={pricePerKWhIn} onChange={(e) => { setPricePerKWhIn(e.target.value); syncNumber(e.target.value, setPricePerKWh); }} />
                                            <span className="text-sm text-muted-foreground">{currency} / kWh</span>
                                        </div>
                                        <Slider value={[pricePerKWh]} onValueChange={(v) => { setPricePerKWh(v[0]); setPricePerKWhIn(String(v[0])); }} min={0.04} max={0.60} step={0.01} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="ice" className="space-y-5 pt-4">
                                    <div className="space-y-2">
                                        <Label>Fuel Type</Label>
                                        <Select value={fuelKind} onValueChange={(v: FuelKind) => setFuelKind(v)}>
                                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Petrol">Petrol</SelectItem>
                                                <SelectItem value="Diesel">Diesel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Fuel price</Label>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" className="w-28" value={fuelPriceIn} onChange={(e) => { setFuelPriceIn(e.target.value); syncNumber(e.target.value, setFuelPrice); }} />
                                            <span className="text-sm text-muted-foreground">{currency} / litre</span>
                                        </div>
                                        <Slider value={[fuelPrice]} onValueChange={(v) => { setFuelPrice(v[0]); setFuelPriceIn(String(v[0])); }} min={0.50} max={3.50} step={0.05} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Average mileage</Label>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" className="w-28" value={mileageIn} onChange={(e) => { setMileageIn(e.target.value); syncNumber(e.target.value, setMileageKmPerL); }} />
                                            <span className="text-sm text-muted-foreground">km / litre</span>
                                        </div>
                                        <Slider value={[mileageKmPerL]} onValueChange={(v) => { setMileageKmPerL(v[0]); setMileageIn(String(v[0])); }} min={5} max={40} step={0.5} />
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select value={currency} onValueChange={(v: Currency) => setCurrency(v)}>
                                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                            <SelectItem value="INR">INR</SelectItem>
                                            <SelectItem value="AUD">AUD</SelectItem>
                                            <SelectItem value="CAD">CAD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-end">
                                    <Button onClick={calculate}>Calculate</Button>
                                    <Button variant="secondary" onClick={clearAll}>Clear</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right column: Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {results ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <KPI label={`Trip distance`} value={`${results.distanceKm.toLocaleString()} km`} />
                                        <KPI label={`EV travel cost`} value={fmtMoney(results.evCost, currency)} />
                                        <KPI label={`Conventional travel cost`} value={fmtMoney(results.iceCost, currency)} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={[{ name: "EV", cost: results.evCost }, { name: "ICE", cost: results.iceCost }]} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis tickFormatter={(v: number) => fmtMoney(v, currency)} width={90} />
                                                    <Tooltip formatter={(v: number | string) => (typeof v === "number" ? fmtMoney(v, currency) : v)} />
                                                    <Legend />
                                                    <Bar dataKey="cost" name="Cost" fill="hsl(var(--primary))" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="border rounded-md p-4 space-y-2">
                                            <div className="text-sm text-muted-foreground">Consumption (normalized)</div>
                                            <div className="text-xl font-semibold">EV: {results.evKWhPer100.toFixed(1)} kWh / 100 km</div>
                                            <div className="text-xl font-semibold">ICE: {results.iceLPer100.toFixed(1)} L / 100 km</div>
                                            <Separator className="my-2" />
                                            <div className="text-sm text-muted-foreground">Estimated savings this trip</div>
                                            <div className="text-2xl font-semibold">{fmtMoney(results.savings, currency)}</div>
                                        </div>
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
                                                    <TableCell>EV cost for {results.distanceKm} km</TableCell>
                                                    <TableCell className="text-right">{fmtMoney(results.evCost, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Conventional cost for {results.distanceKm} km</TableCell>
                                                    <TableCell className="text-right">{fmtMoney(results.iceCost, currency)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Savings (ICE − EV)</TableCell>
                                                    <TableCell className="text-right">{fmtMoney(results.savings, currency)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground py-16">Adjust inputs on the left and click <b>Calculate</b> to compare costs.</div>
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
