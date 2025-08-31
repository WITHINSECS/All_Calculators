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

// 1 ft‑lb = 12 in‑lb
const IN_PER_FT = 12;
// Helpful extra: 1 ft‑lb = 1.3558179483314004 N·m
const NM_PER_FT_LB = 1.3558179483314004;

function fmt(n: number, precision: number): string {
    const s = n.toFixed(precision);
    return s.replace(/\.0+$|(?<=\.\d*[1-9])0+$/g, "");
}

export default function TorqueConverter(): JSX.Element {
    const [precision, setPrecision] = useState<number>(3);
    const [inchInput, setInchInput] = useState<string>("");
    const [footInput, setFootInput] = useState<string>("");
    const [lastEdited, setLastEdited] = useState<"in" | "ft" | null>(null);

    const syncFromInch = (raw: string): void => {
        setInchInput(raw);
        setLastEdited("in");
        if (raw === "") { setFootInput(""); return; }
        const v = Number(raw);
        if (!Number.isFinite(v)) { toast.error("Invalid inch‑pounds value."); return; }
        setFootInput(fmt(v / IN_PER_FT, precision));
    };

    const syncFromFoot = (raw: string): void => {
        setFootInput(raw);
        setLastEdited("ft");
        if (raw === "") { setInchInput(""); return; }
        const v = Number(raw);
        if (!Number.isFinite(v)) { toast.error("Invalid foot‑pounds value."); return; }
        setInchInput(fmt(v * IN_PER_FT, precision));
    };

    const onClear = (): void => {
        setInchInput("");
        setFootInput("");
        setLastEdited(null);
    };

    // Optional KPIs derived from whichever side is populated (prefers ft‑lb)
    const ftVal = footInput !== "" ? Number(footInput) : (inchInput !== "" ? Number(inchInput) / IN_PER_FT : NaN);
    const nmVal = Number.isFinite(ftVal) ? ftVal * NM_PER_FT_LB : NaN;

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Inch‑Pounds ⇄ Foot‑Pounds Converter</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Type in either box — the other updates instantly. Default shadcn styling.</p>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-2">
                        <CardTitle>Torque</CardTitle>
                        <div className="flex items-center gap-2">
                            <Label className="text-sm">Precision</Label>
                            <Select value={String(precision)} onValueChange={(v: string) => setPrecision(Number(v))}>
                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">0</SelectItem>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label>Inch‑pounds</Label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                placeholder="in‑lb"
                                value={inchInput}
                                onChange={(e) => syncFromInch(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Foot‑pounds</Label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                placeholder="ft‑lb"
                                value={footInput}
                                onChange={(e) => syncFromFoot(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <Button onClick={() => (lastEdited === "in" ? syncFromInch(inchInput) : syncFromFoot(footInput))}>Recalculate</Button>
                            <Button variant="secondary" onClick={onClear}>Clear</Button>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <KPI label="1 ft‑lb =" value="12 in‑lb" />
                            <KPI label="1 in‑lb =" value="0.083333 ft‑lb" />
                            {Number.isFinite(nmVal) && (
                                <KPI label="Also equals" value={`${fmt(nmVal, precision)} N·m`} />
                            )}
                        </div>
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
