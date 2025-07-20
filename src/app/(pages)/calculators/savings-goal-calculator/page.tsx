"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Wrapper from "@/app/Wrapper";

const frequencies = {
    monthly: 12,
    weekly: 52,
    daily: 365,
};


export default function SavingsCalculator() {
    const [currency, setCurrency] = useState("$");
    const [balance, setBalance] = useState("");
    const [goal, setGoal] = useState("");
    const [deposit, setDeposit] = useState("");
    const [frequency, setFrequency] = useState<"monthly" | "weekly" | "daily">("monthly");
    const [interest, setInterest] = useState("");
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const current = parseFloat(balance);
        const target = parseFloat(goal);
        const depositAmount = parseFloat(deposit);
        const annualRate = parseFloat(interest) / 100;
        const compounding = frequencies[frequency];

        if (isNaN(current) || isNaN(target) || isNaN(depositAmount) || isNaN(annualRate)) {
            setResult("Please fill in all fields correctly.");
            return;
        }

        if (current >= target) {
            setResult("You have already reached your goal!");
            return;
        }

        let months = 0;
        let total = current;
        const r = annualRate / compounding;

        while (total < target && months < 1000 * compounding) {
            total = total * (1 + r) + depositAmount;
            months++;
        }

        const years = months / compounding;
        const yearsRounded = Math.floor(years);
        const monthsRounded = Math.round((years - yearsRounded) * 12);

        if (months >= 1000 * compounding) {
            setResult("Goal not reachable with the current plan.");
        } else {
            setResult(`You will reach your goal in about ${yearsRounded} years and ${monthsRounded} months.`);
        }
    };

    return (

        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Savings Goal Calculators
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto space-y-6 p-6 border rounded-lg shadow">
                    <div>
                        <Label className="mb-2 block">Currency</Label>
                        <ToggleGroup type="single" value={currency} onValueChange={(val) => val && setCurrency(val)}>
                            {["$", "€", "£", "₹", "¥"].map((sym) => (
                                <ToggleGroupItem key={sym} value={sym} aria-label={sym}>
                                    {sym}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <div>
                        <Label className="mb-1.5">Current balance</Label>
                        <div className="flex items-center gap-2">
                            <span>{currency}</span>
                            <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label className="mb-1.5">Your savings goal</Label>
                        <div className="flex items-center gap-2">
                            <span>{currency}</span>
                            <Input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label className="mb-1.5">Deposits being made</Label>
                        <div className="flex items-center gap-2">
                            <span>{currency}</span>
                            <Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                            <Select value={frequency} onValueChange={(val) => setFrequency(val as "monthly" | "weekly" | "daily")}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label className="mb-1.5">Annual interest rate (%)</Label>
                        <Input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} />
                    </div>

                    <Button className="w-full mt-2" onClick={calculate}>
                        Calculate
                    </Button>

                    {result && <p className="mt-4 font-medium text-center">{result}</p>}
                </div>
            </div>
        </Wrapper>
    );
}
