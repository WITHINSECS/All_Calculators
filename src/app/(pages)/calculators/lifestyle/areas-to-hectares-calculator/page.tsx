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

// 1 hectare = 100 ares
const ARES_PER_HA = 100;

function fmt(n: number, precision: number): string {
    const s = n.toFixed(precision);
    // trim trailing zeros
    return s.replace(/\.0+$|(?<=\.\d*[1-9])0+$/g, "");
}

export default function AreaConverter(): JSX.Element {
    const [precision, setPrecision] = useState<number>(3);

    const [aresInput, setAresInput] = useState<string>("");
    const [hectaresInput, setHectaresInput] = useState<string>("");
    const [lastEdited, setLastEdited] = useState<"a" | "ha" | null>(null);

    const syncFromAres = (raw: string): void => {
        setAresInput(raw);
        setLastEdited("a");
        if (raw === "") { setHectaresInput(""); return; }
        const v = Number(raw);
        if (!Number.isFinite(v)) { toast.error("Invalid ares value."); return; }
        setHectaresInput(fmt(v / ARES_PER_HA, precision));
    };

    const syncFromHectares = (raw: string): void => {
        setHectaresInput(raw);
        setLastEdited("ha");
        if (raw === "") { setAresInput(""); return; }
        const v = Number(raw);
        if (!Number.isFinite(v)) { toast.error("Invalid hectares value."); return; }
        setAresInput(fmt(v * ARES_PER_HA, precision));
    };

    const onClear = (): void => {
        setAresInput("");
        setHectaresInput("");
        setLastEdited(null);
    };

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Ares ⇄ Hectares Converter</h1>
                    <p className="text-muted-foreground mt-3 text-lg">Type in either field — the other updates instantly.</p>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-2">
                        <CardTitle>Area</CardTitle>
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
                            <Label>Ares</Label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                placeholder="a"
                                value={aresInput}
                                onChange={(e) => syncFromAres(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Hectares</Label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                placeholder="ha"
                                value={hectaresInput}
                                onChange={(e) => syncFromHectares(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <Button onClick={() => (lastEdited === "a" ? syncFromAres(aresInput) : syncFromHectares(hectaresInput))}>Recalculate</Button>
                            <Button variant="secondary" onClick={onClear}>Clear</Button>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <KPI label="1 ha =" value="100 a" />
                            <KPI label="1 a =" value="0.01 ha" />
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
