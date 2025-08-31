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

// ---------------- Types ----------------
type DistUnit = "km" | "mi";
type EffUnit = "L/100km" | "km/L" | "mpgUS";
type VolUnit = "L" | "galUS";
type PriceUnit = "perL" | "perGal";

// ---------------- Constants -------------
const GAL_TO_L = 3.785411784; // US gallon
const MI_TO_KM = 1.609344;

// USD formatting only
const fmtUSD = (n: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0
  );

// ---------------- Helpers ----------------
const kmFrom = (x: number, u: DistUnit): number => (u === "km" ? x : x * MI_TO_KM);
const LFrom = (x: number, u: VolUnit): number => (u === "L" ? x : x * GAL_TO_L);
const pricePerL = (price: number, u: PriceUnit): number => (u === "perL" ? price : price / GAL_TO_L);

// Normalize efficiency to liters per km
const lPerKmFrom = (value: number, u: EffUnit): number => {
  if (u === "L/100km") return value / 100; // L per km
  if (u === "km/L") return 1 / value;
  // mpg US
  return (GAL_TO_L / value) / MI_TO_KM; // L per mile -> per km
};

export default function FuelCostCalculator(): JSX.Element {
  // Inputs (strings so they can be empty)
  const [distInput, setDistInput] = useState<string>("");
  const [distUnit, setDistUnit] = useState<DistUnit>("km");

  const [effValueInput, setEffValueInput] = useState<string>("");
  const [effUnit, setEffUnit] = useState<EffUnit>("L/100km");

  const [fuelAmtInput, setFuelAmtInput] = useState<string>(""); // optional override
  const [fuelAmtUnit, setFuelAmtUnit] = useState<VolUnit>("L");

  const [priceInput, setPriceInput] = useState<string>("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("perL");

  const [result, setResult] = useState<
    | null
    | {
      litersNeeded: number;
      gallonsNeeded: number;
      usdPerL: number;
      tripCost: number;
      costPerKm: number;
      costPerMi: number;
      effL100km: number;
      effMpgUS: number;
    }
  >(null);

  const onCalculate = (): void => {
    // price required always
    if (priceInput.trim() === "") { toast.error("Enter fuel price in USD."); return; }
    const price = Number(priceInput);
    if (!Number.isFinite(price) || price <= 0) { toast.error("Fuel price must be greater than 0."); return; }
    const usdPerLiter = pricePerL(price, priceUnit);

    let litersNeeded: number;

    if (fuelAmtInput.trim() !== "") {
      // use explicit fuel amount
      const amt = Number(fuelAmtInput);
      if (!Number.isFinite(amt) || amt <= 0) { toast.error("Fuel amount must be greater than 0."); return; }
      litersNeeded = LFrom(amt, fuelAmtUnit);
    } else {
      // need distance and efficiency
      if (distInput.trim() === "" || effValueInput.trim() === "") {
        toast.error("Enter distance and fuel efficiency, or provide a fuel amount.");
        return;
      }
      const d = Number(distInput);
      const e = Number(effValueInput);
      if (!Number.isFinite(d) || d <= 0) { toast.error("Distance must be greater than 0."); return; }
      if (!Number.isFinite(e) || e <= 0) { toast.error("Fuel efficiency must be greater than 0."); return; }
      const km = kmFrom(d, distUnit);
      const lPerKm = lPerKmFrom(e, effUnit);
      litersNeeded = km * lPerKm;
    }

    const tripCost = litersNeeded * usdPerLiter;

    // Extra metrics if distance+eff provided
    let costPerKm = NaN, costPerMi = NaN, effL100km = NaN, effMpgUS = NaN;
    if (distInput.trim() !== "" && effValueInput.trim() !== "") {
      const e = Number(effValueInput);
      const lpk = lPerKmFrom(e, effUnit);
      effL100km = lpk * 100;
      effMpgUS = 1 / ((lpk * MI_TO_KM) / GAL_TO_L); // mpg = miles / gallons
      costPerKm = usdPerLiter * lpk;
      costPerMi = costPerKm * MI_TO_KM;
    }

    setResult({
      litersNeeded,
      gallonsNeeded: litersNeeded / GAL_TO_L,
      usdPerL: usdPerLiter,
      tripCost,
      costPerKm,
      costPerMi,
      effL100km,
      effMpgUS,
    });
  };

  const onClear = (): void => {
    setDistInput("");
    setEffValueInput("");
    setFuelAmtInput("");
    setPriceInput("");
    setResult(null);
  };

  const previewTripCost = useMemo(() => (result ? fmtUSD(result.tripCost) : ""), [result]);

  return (
    <Wrapper>
      <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Fuel Cost Calculator</h1>
          <p className="text-muted-foreground mt-3 text-lg">USD‑only. Enter distance & efficiency <em>or</em> a fuel amount, plus fuel price.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Distance */}
            <div className="space-y-2">
              <Label>Distance</Label>
              <div className="grid grid-cols-3 gap-3">
                <Input className="col-span-2" type="number" placeholder="e.g. 250" value={distInput} onChange={(e) => setDistInput(e.target.value)} />
                <Select value={distUnit} onValueChange={(v: DistUnit) => setDistUnit(v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="mi">mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Efficiency */}
            <div className="space-y-2">
              <Label>Fuel efficiency</Label>
              <div className="grid grid-cols-3 gap-3">
                <Input className="col-span-2" type="number" placeholder="e.g. 7.5 or 30" value={effValueInput} onChange={(e) => setEffValueInput(e.target.value)} />
                <Select value={effUnit} onValueChange={(v: EffUnit) => setEffUnit(v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L/100km">L/100 km</SelectItem>
                    <SelectItem value="km/L">km / L</SelectItem>
                    <SelectItem value="mpgUS">mpg (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fuel amount (optional) */}
            <div className="space-y-2">
              <Label>Fuel amount (optional)</Label>
              <div className="grid grid-cols-3 gap-3">
                <Input className="col-span-2" type="number" placeholder="e.g. 50" value={fuelAmtInput} onChange={(e) => setFuelAmtInput(e.target.value)} />
                <Select value={fuelAmtUnit} onValueChange={(v: VolUnit) => setFuelAmtUnit(v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="galUS">gal (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-muted-foreground">If you provide a fuel amount, distance/efficiency are ignored for cost.</div>
            </div>

            {/* Fuel price */}
            <div className="space-y-2">
              <Label>Fuel price</Label>
              <div className="grid grid-cols-3 gap-3">
                <Input className="col-span-2" type="number" placeholder="USD per unit" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                <Select value={priceUnit} onValueChange={(v: PriceUnit) => setPriceUnit(v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perL">/ L</SelectItem>
                    <SelectItem value="perGal">/ gal (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Button onClick={onCalculate}>Calculate</Button>
              <Button variant="secondary" onClick={onClear}>Clear</Button>
            </div>

            <Separator />

            {/* Results */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Trip cost</Label>
                <Input readOnly placeholder="USD" value={previewTripCost} />
              </div>

              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="text-sm text-muted-foreground">Fuel needed</div>
                    <div className="text-xl font-semibold">{result.litersNeeded.toFixed(2)} L ({result.gallonsNeeded.toFixed(2)} gal)</div>
                    <div className="text-sm text-muted-foreground">Fuel price</div>
                    <div className="text-xl font-semibold">{fmtUSD(result.usdPerL)} / L</div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="text-sm text-muted-foreground mb-2">Unit costs</div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Number.isFinite(result.costPerKm) && (
                          <TableRow>
                            <TableCell>Cost / km</TableCell>
                            <TableCell className="text-right">{fmtUSD(result.costPerKm)}</TableCell>
                          </TableRow>
                        )}
                        {Number.isFinite(result.costPerMi) && (
                          <TableRow>
                            <TableCell>Cost / mile</TableCell>
                            <TableCell className="text-right">{fmtUSD(result.costPerMi)}</TableCell>
                          </TableRow>
                        )}
                        {Number.isFinite(result.effL100km) && (
                          <TableRow>
                            <TableCell>Efficiency</TableCell>
                            <TableCell className="text-right">{result.effL100km.toFixed(2)} L/100km ({result.effMpgUS.toFixed(1)} mpg US)</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}