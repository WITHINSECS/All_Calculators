"use client";

import { useMemo, useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PopOrSample = "population" | "sample";

type Stats = {
  n: number;
  sum: number;
  mean: number;
  variance: number;
  sd: number;
  moe: number; // margin of error for mean
};

function parseNumbers(raw: string): number[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t))
    .filter((v) => Number.isFinite(v));
}

function zForConfidence(conf: number): number {
  // Normal approximation
  if (conf === 90) return 1.645;
  if (conf === 99) return 2.576;
  return 1.96; // 95%
}

function computeStats(values: number[], kind: PopOrSample, conf: number): Stats {
  const n = values.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = n > 0 ? sum / n : NaN;

  const ss = values.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);
  const divisor = kind === "sample" ? Math.max(1, n - 1) : Math.max(1, n);
  const variance = n > 0 ? ss / divisor : NaN;
  const sd = Math.sqrt(variance);

  const z = zForConfidence(conf);
  const moe = n > 0 ? z * sd / Math.sqrt(n) : NaN;

  return { n, sum, mean, variance, sd, moe };
}

export default function StandardDeviationCalculator() {
  const [numbers, setNumbers] = useState<string>("");
  const [kind, setKind] = useState<PopOrSample>("population");
  const [confidence, setConfidence] = useState<number>(95);
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const values = useMemo(() => parseNumbers(numbers), [numbers]);
  const stats = useMemo(() => computeStats(values, kind, confidence), [values, kind, confidence]);

  const onCalculate = () => {
    if (!numbers.trim()) {
      setError("Please enter numbers separated by commas.");
      setShow(false);
      return;
    }
    if (values.length === 0) {
      setError("No valid numbers found. Check your input.");
      setShow(false);
      return;
    }
    if (kind === "sample" && values.length < 2) {
      setError("Sample requires at least two numbers.");
      setShow(false);
      return;
    }
    setError(null);
    setShow(true);
  };

  const onClear = () => {
    setNumbers("");
    setShow(false);
    setError(null);
  };

  // Pretty, step-by-step formulas
  const formulaLines = useMemo(() => {
    if (!show || values.length === 0) return null;
    const symbolMean = kind === "population" ? "μ" : "x̄";
    const denom =
      kind === "population" ? "N" : "n - 1";
    const confText = `${confidence}% (z = ${zForConfidence(confidence)})`;

    return [
      `Mean (${symbolMean}) = (Σxᵢ) / n = (${stats.sum}) / ${stats.n} = ${stats.mean}`,
      `Variance (${kind}) = Σ(xᵢ - ${symbolMean})² / ${denom} = ${stats.variance}`,
      `Standard deviation = √(variance) = ${stats.sd}`,
      `Margin of error (${confText}) = z · (sd / √n) = ${stats.moe}`,
    ];
  }, [show, values.length, kind, confidence, stats]);

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-3xl">
        <div className="mx-auto text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Standard Deviation Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Provide numbers separated by commas to calculate the standard deviation, variance, mean, sum, and margin of error.
          </p>
        </div>

        <div className="space-y-5">
          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter numbers</Label>
            <textarea
              id="numbers"
              className="w-full border rounded-md p-3"
              rows={3}
              placeholder="e.g. 10, 12, 23, 23, 16, 23, 21, 16"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
            />
          </div>

          {/* Population vs Sample */}
          <div className="flex items-center gap-4">
            <span className="text-sm">It is a</span>
            <RadioGroup
              value={kind}
              onValueChange={(v: PopOrSample) => setKind(v)}
              className="flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="population" value="population" />
                <Label htmlFor="population">Population</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="sample" value="sample" />
                <Label htmlFor="sample">Sample</Label>
              </div>
            </RadioGroup>

            {/* Confidence level */}
            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="confidence" className="text-sm">
                Confidence
              </Label>
              <Select
                value={String(confidence)}
                onValueChange={(v) => setConfidence(Number(v))}
              >
                <SelectTrigger id="confidence" className="w-28">
                  <SelectValue placeholder="95%" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={onCalculate}>Calculate</Button>
            <Button variant="secondary" onClick={onClear}>
              Clear
            </Button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Results */}
          {show && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-md border p-3">
                  <div className="text-sm text-muted-foreground">Count (n)</div>
                  <div className="text-xl font-semibold">{stats.n}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm text-muted-foreground">Sum (Σxᵢ)</div>
                  <div className="text-xl font-semibold">{stats.sum}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm text-muted-foreground">Mean</div>
                  <div className="text-xl font-semibold">
                    {Number.isFinite(stats.mean) ? Number(stats.mean.toFixed(6)) : "-"}
                  </div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm text-muted-foreground">
                    Variance ({kind})
                  </div>
                  <div className="text-xl font-semibold">
                    {Number.isFinite(stats.variance)
                      ? Number(stats.variance.toFixed(6))
                      : "-"}
                  </div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm text-muted-foreground">Std. Deviation</div>
                  <div className="text-xl font-semibold">
                    {Number.isFinite(stats.sd) ? Number(stats.sd.toFixed(6)) : "-"}
                  </div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm text-muted-foreground">
                    Margin of Error ({confidence}%)
                  </div>
                  <div className="text-xl font-semibold">
                    {Number.isFinite(stats.moe) ? Number(stats.moe.toFixed(6)) : "-"}
                  </div>
                </div>
              </div>

              {/* Formulas */}
              <div className="rounded-md border p-3">
                <div className="mb-2 font-medium">How it’s calculated</div>
                <pre className="whitespace-pre-wrap font-mono text-sm">
{formulaLines?.join("\n")}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
