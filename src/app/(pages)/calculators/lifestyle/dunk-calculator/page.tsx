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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

// ---------------- Types ----------------
type UnitLen = "m" | "ft";
type UnitMass = "kg" | "lb";

type HoopPreset = "standard10" | "nine" | "eight" | "custom";

interface Results {
    requiredJumpM: number; // meters
    apexM: number; // standing reach + jump
    hangTime: number; // seconds
    energyJ: number; // Joules
    v0: number; // m/s
}

// ---------------- Utils ----------------
const FT_TO_M = 0.3048;
const LB_TO_KG = 0.45359237;
const G = 9.80665; // m/s^2

const toMeters = (x: number, u: UnitLen): number => (u === "m" ? x : x * FT_TO_M);
const fromMeters = (x: number, u: UnitLen): number => (u === "m" ? x : x / FT_TO_M);
const toKg = (x: number, u: UnitMass): number => (u === "kg" ? x : x * LB_TO_KG);

const fmtLen = (m: number, u: UnitLen, digits = 3): string => {
    const v = fromMeters(m, u);
    return `${v.toFixed(digits)} ${u}`;
};

// ---------------- Component -------------
export default function DunkCalculator(): JSX.Element {
    // Preset hoop heights
    const [preset, setPreset] = useState<HoopPreset>("standard10");
    const [lenUnit, setLenUnit] = useState<UnitLen>("m");
    const [massUnit, setMassUnit] = useState<UnitMass>("kg");

    // Inputs held as strings so fields can be empty
    const [hoopHeightIn, setHoopHeightIn] = useState<string>("3.048"); // 10 ft default (m)
    const [standingReachIn, setStandingReachIn] = useState<string>("");
    const [bodyMassIn, setBodyMassIn] = useState<string>("");

    // Clearance above rim your hand needs to control the ball
    const [clearanceIn, setClearanceIn] = useState<string>("0.15"); // meters (~6 in)

    const [res, setRes] = useState<Results | null>(null);

    // Update input when preset changes
    const applyPreset = (p: HoopPreset, unit: UnitLen): string => {
        let m = 3.048; // default 10 ft
        if (p === "nine") m = 2.7432;
        if (p === "eight") m = 2.4384;
        return unit === "m" ? String(m) : String((m / FT_TO_M).toFixed(3));
    };

    // keep hoop height synced with preset unless custom
    const onPresetChange = (p: HoopPreset): void => {
        setPreset(p);
        if (p !== "custom") {
            setHoopHeightIn(applyPreset(p, lenUnit));
        }
    };

    const onUnitChange = (u: UnitLen): void => {
        // convert existing numeric inputs between units where applicable
        const toNum = (s: string): number | null => (s.trim() === "" ? null : Number(s));
        const h = toNum(hoopHeightIn);
        const r = toNum(standingReachIn);
        const c = toNum(clearanceIn);

        if (h != null && Number.isFinite(h)) {
            const m = toMeters(h, lenUnit);
            setHoopHeightIn(String(fromMeters(m, u).toFixed(3)));
        }
        if (r != null && Number.isFinite(r)) {
            const m = toMeters(r, lenUnit);
            setStandingReachIn(String(fromMeters(m, u).toFixed(3)));
        }
        if (c != null && Number.isFinite(c)) {
            const m = toMeters(c, lenUnit);
            setClearanceIn(String(fromMeters(m, u).toFixed(3)));
        }
        setLenUnit(u);
    };

    const calculate = (): void => {
        try {
            // validations
            if (hoopHeightIn === "" || standingReachIn === "" || bodyMassIn === "") {
                toast.error("Please fill hoop height, standing reach, and body mass.");
                return;
            }
            const hoop = Number(hoopHeightIn);
            const reach = Number(standingReachIn);
            const mass = Number(bodyMassIn);
            const clearance = Number(clearanceIn || 0);

            if (!Number.isFinite(hoop) || hoop <= 0) { toast.error("Invalid hoop height."); return; }
            if (!Number.isFinite(reach) || reach <= 0) { toast.error("Invalid standing reach."); return; }
            if (!Number.isFinite(mass) || mass <= 0) { toast.error("Invalid body mass."); return; }
            if (!Number.isFinite(clearance) || clearance < 0) { toast.error("Invalid clearance."); return; }

            const hoopM = toMeters(hoop, lenUnit);
            const reachM = toMeters(reach, lenUnit);
            const clearanceM = toMeters(clearance, lenUnit);
            const massKg = toKg(mass, massUnit);

            const target = hoopM + clearanceM;
            const requiredJumpM = Math.max(0, target - reachM);

            // physics
            const v0 = Math.sqrt(2 * G * requiredJumpM);
            const hangTime = 2 * v0 / G; // total flight time
            const energyJ = massKg * G * requiredJumpM; // work against gravity
            const apexM = reachM + requiredJumpM;

            setRes({ requiredJumpM, apexM, hangTime, energyJ, v0 });
        } catch (e) {
            toast.error("Could not compute. Check inputs.");
        }
    };

    const clearAll = (): void => {
        setStandingReachIn("");
        setBodyMassIn("");
        setClearanceIn("0.15");
        setRes(null);
        // keep preset and hoop height
    };

    // chart data
    const chartData = useMemo(() => {
        if (!res) return [] as Array<{ name: string; meters: number }>;
        return [
            { name: "Standing reach", meters: toMeters(Number(standingReachIn || 0), lenUnit) },
            { name: "Rim + clearance", meters: toMeters(Number(hoopHeightIn || 0), lenUnit) + toMeters(Number(clearanceIn || 0), lenUnit) },
            { name: "Apex", meters: res.apexM },
        ];
    }, [res, hoopHeightIn, standingReachIn, clearanceIn, lenUnit]);

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-5xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Dunk Calculator</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Find the minimum vertical leap and hang time you need to dunk.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hoop & body details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Hoop type</Label>
                                    <Select value={preset} onValueChange={(v: HoopPreset) => onPresetChange(v)}>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard10">7th grade or above (standard 10 ft)</SelectItem>
                                            <SelectItem value="nine">9 ft rim</SelectItem>
                                            <SelectItem value="eight">8 ft rim</SelectItem>
                                            <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Length unit</Label>
                                    <Select value={lenUnit} onValueChange={(v: UnitLen) => onUnitChange(v)}>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="m">meters</SelectItem>
                                            <SelectItem value="ft">feet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Hoop height</Label>
                                <Input type="number" value={hoopHeightIn} onChange={(e) => {
                                    setHoopHeightIn(e.target.value);
                                    setPreset("custom");
                                }} />
                                <div className="text-xs text-muted-foreground">{lenUnit === "m" ? "10 ft = 3.048 m" : "10 ft = 10.000 ft"}</div>
                            </div>

                            <div className="space-y-2">
                                <Label>Body mass</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input type="number" value={bodyMassIn} onChange={(e) => setBodyMassIn(e.target.value)} placeholder={massUnit === "kg" ? "e.g. 80" : "e.g. 176"} />
                                    <Select value={massUnit} onValueChange={(v: UnitMass) => setMassUnit(v)}>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="lb">lb</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Standing reach</Label>
                                <Input type="number" value={standingReachIn} onChange={(e) => setStandingReachIn(e.target.value)} placeholder={lenUnit === "m" ? "e.g. 2.30" : "e.g. 7.5"} />
                            </div>

                            <div className="space-y-2">
                                <Label>Clearance above rim</Label>
                                <Input type="number" value={clearanceIn} onChange={(e) => setClearanceIn(e.target.value)} />
                                <div className="text-xs text-muted-foreground">Typical: 0.10–0.25 {lenUnit} (one‑hand vs two‑hand).</div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-1">
                                <Button onClick={calculate}>Calculate</Button>
                                <Button variant="secondary" onClick={clearAll}>Clear</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Jump details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {res ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <KPI label="Minimum vertical leap" value={`${(res.requiredJumpM * 100).toFixed(1)} cm`} />
                                        <KPI label="Hang time" value={`${res.hangTime.toFixed(2)} sec`} />
                                        <KPI label="Jumping energy" value={`${res.energyJ.toFixed(0)} J`} />
                                        <KPI label="Initial jumping speed" value={`${res.v0.toFixed(2)} m/s`} />
                                    </div>

                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis tickFormatter={(v: number) => fmtLen(v, lenUnit, 2)} width={90} />
                                                <Tooltip formatter={(v: number | string) => (typeof v === "number" ? fmtLen(v, lenUnit, 3) : v)} />
                                                <Legend />
                                                <Bar dataKey="meters" name={`Height (${lenUnit})`} fill="hsl(var(--primary))" />
                                            </BarChart>
                                        </ResponsiveContainer>
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
                                                    <TableCell>Rim + clearance</TableCell>
                                                    <TableCell className="text-right">{fmtLen(toMeters(Number(hoopHeightIn || 0), lenUnit) + toMeters(Number(clearanceIn || 0), lenUnit), lenUnit)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Apex (reach + jump)</TableCell>
                                                    <TableCell className="text-right">{fmtLen(res.apexM, lenUnit)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Standing reach</TableCell>
                                                    <TableCell className="text-right">{fmtLen(toMeters(Number(standingReachIn || 0), lenUnit), lenUnit)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground py-16">Fill the inputs and click <b>Calculate</b> to see your required vertical and physics.</div>
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
