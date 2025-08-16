"use client";

import { useMemo, useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// ---------- math core (linear only: ax + b) ----------

type Lin = { a: number; b: number }; // represents a*x + b

type TokType = "num" | "var" | "op" | "lpar" | "rpar";
type Token = { t: TokType; v: string };

const VARS = new Set(["x"]); // easy to extend later

function tokenize(expr: string): Token[] {
  const s = expr.replace(/\s+/g, "");
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];

    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      out.push({ t: "num", v: s.slice(i, j) });
      i = j;
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      const name = s.slice(i, j);
      if (!VARS.has(name)) throw new Error(`Unknown symbol "${name}"`);
      out.push({ t: "var", v: name });
      i = j;
      continue;
    }

    if ("+-*/".includes(ch)) {
      out.push({ t: "op", v: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      out.push({ t: "lpar", v: ch });
      i++;
      continue;
    }
    if (ch === ")") {
      out.push({ t: "rpar", v: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character "${ch}"`);
  }
  // insert implicit multiplication (e.g., 3x or 2(1+x) or )(
  const withImplicit: Token[] = [];
  for (let k = 0; k < out.length; k++) {
    const t = out[k];
    withImplicit.push(t);
    const next = out[k + 1];
    if (!next) break;
    const needMul =
      (t.t === "num" || t.t === "var" || t.t === "rpar") &&
      (next.t === "var" || next.t === "num" || next.t === "lpar");
    if (needMul) withImplicit.push({ t: "op", v: "*" });
  }
  return withImplicit;
}

function toRPN(tokens: Token[]): Token[] {
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const out: Token[] = [];
  const ops: Token[] = [];

  // unary minus handling: convert "-x" or "-( … )" to "0 x -"
  const ts: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = tokens[i - 1];
    if (t.t === "op" && t.v === "-" && (!prev || (prev.t !== "num" && prev.t !== "var" && prev.t !== "rpar"))) {
      ts.push({ t: "num", v: "0" });
      ts.push({ t: "op", v: "-" });
      continue;
    }
    ts.push(t);
  }

  for (const t of ts) {
    if (t.t === "num" || t.t === "var") out.push(t);
    else if (t.t === "op") {
      while (
        ops.length &&
        ops[ops.length - 1].t === "op" &&
        prec[ops[ops.length - 1].v] >= prec[t.v]
      ) {
        out.push(ops.pop() as Token);
      }
      ops.push(t);
    } else if (t.t === "lpar") ops.push(t);
    else if (t.t === "rpar") {
      while (ops.length && ops[ops.length - 1].t !== "lpar") {
        out.push(ops.pop() as Token);
      }
      if (!ops.length) throw new Error("Mismatched parentheses");
      ops.pop(); // remove '('
    }
  }
  while (ops.length) {
    const top = ops.pop() as Token;
    if (top.t === "lpar" || top.t === "rpar") throw new Error("Mismatched parentheses");
    out.push(top);
  }
  return out;
}

function linAdd(p: Lin, q: Lin): Lin {
  return { a: p.a + q.a, b: p.b + q.b };
}
function linSub(p: Lin, q: Lin): Lin {
  return { a: p.a - q.a, b: p.b - q.b };
}
function linMul(p: Lin, q: Lin): Lin {
  // only allow at most one term with variable
  if (p.a !== 0 && q.a !== 0) throw new Error("Nonlinear term (x·x) is not supported.");
  if (q.a === 0) return { a: p.a * q.b, b: p.b * q.b };
  // p has no variable
  if (p.a === 0) return { a: q.a * p.b, b: q.b * p.b };
  // should not reach
  return { a: 0, b: 0 };
}
function linDiv(p: Lin, q: Lin): Lin {
  if (q.a !== 0) throw new Error("Division by an expression with x is not supported.");
  if (q.b === 0) throw new Error("Division by zero.");
  return { a: p.a / q.b, b: p.b / q.b };
}

function evalRPN(rpn: Token[]): Lin {
  const st: Lin[] = [];
  for (const t of rpn) {
    if (t.t === "num") st.push({ a: 0, b: Number(t.v) });
    else if (t.t === "var") st.push({ a: 1, b: 0 });
    else if (t.t === "op") {
      const b = st.pop();
      const a = st.pop();
      if (!a || !b) throw new Error("Malformed expression.");
      const res =
        t.v === "+" ? linAdd(a, b) :
        t.v === "-" ? linSub(a, b) :
        t.v === "*" ? linMul(a, b) :
        linDiv(a, b);
      st.push(res);
    }
  }
  if (st.length !== 1) throw new Error("Malformed expression.");
  return st[0];
}

function simplify(expr: string): Lin {
  const tok = tokenize(expr);
  const rpn = toRPN(tok);
  return evalRPN(rpn);
}

// ---------- UI ----------

export default function EquationSolver() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[] | null>(null);

  const example = "4x+2=2x+12";

  const onSolve = () => {
    setError(null);
    setResult(null);
    setSteps(null);

    if (!input.trim()) {
      setError("Please enter an equation, e.g., 4x+2=2x+12");
      return;
    }

    const parts = input.replace(/\s+/g, "").split("=");
    if (parts.length !== 2) {
      setError("Please include exactly one '=' sign.");
      return;
    }

    try {
      const L = simplify(parts[0]); // aL x + bL
      const R = simplify(parts[1]); // aR x + bR

      // Move terms: (aL - aR) x = (bR - bL)
      const a = L.a - R.a;
      const c = R.b - L.b;

      const localSteps: string[] = [
        `Left simplifies to: ${L.a}x + ${L.b}`,
        `Right simplifies to: ${R.a}x + ${R.b}`,
        `Bring x terms to left and constants to right: (${L.a} - ${R.a})x = (${R.b} - ${L.b})`,
        `${a}x = ${c}`,
      ];

      if (a === 0 && c === 0) {
        localSteps.push("0x = 0 ➜ infinitely many solutions (identity).");
        setSteps(localSteps);
        setResult("All real numbers satisfy the equation.");
        return;
      }
      if (a === 0 && c !== 0) {
        localSteps.push(`0x = ${c} ➜ contradiction.`);
        setSteps(localSteps);
        setResult("No solution.");
        return;
      }

      const x = c / a;
      localSteps.push(`x = ${c} / ${a} = ${x}`);
      setSteps(localSteps);
      setResult(`x = ${x}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to parse equation.";
      setError(msg);
    }
  };

  const onExample = () => setInput(example);
  const onClear = () => {
    setInput("");
    setError(null);
    setResult(null);
    setSteps(null);
  };

  // Small hint for allowed syntax
  const hint = useMemo(
    () =>
      "Allowed: numbers, x, + - * /, and parentheses. Linear equations only (no x*x).",
    []
  );

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Equation Solver</h1>
        </div>

        <div className="space-y-3">
          <Label htmlFor="eq">What do you want to calculate?</Label>
          <div className="flex gap-2">
            <Input
              id="eq"
              className="flex-1"
              placeholder="e.g. 4x+2=2x+12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={onSolve}>Calculate it!</Button>
          </div>
          <div className="text-sm text-muted-foreground">Example: 4x+2=2x+12</div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="text-xl font-semibold">Example (Click to try)</div>
          <Button variant="secondary" onClick={onExample} className="font-semibold">
            4x+2=2x+12
          </Button>
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        {result && (
          <div className="mt-8 space-y-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground mb-1">Solution</div>
              <div className="text-xl font-semibold">{result}</div>
            </div>

            {steps && (
              <div className="rounded-md border p-4">
                <div className="mb-2 font-medium">Steps</div>
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {steps.join("\n")}
                </pre>
              </div>
            )}

            <div className="rounded-md border p-4">
              <div className="mb-2 font-medium">Notes</div>
              <p className="text-sm text-muted-foreground">
                {hint}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={onClear} variant="secondary">Clear</Button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
