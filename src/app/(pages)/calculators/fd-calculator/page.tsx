"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from '@/app/Wrapper';
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

// Define the available compounding frequencies and their corresponding periods per year
const compoundingFrequencies = [
    { value: "Monthly", label: "Monthly", periods: 12 },
    { value: "Quarterly", label: "Quarterly", periods: 4 },
    { value: "HalfYearly", label: "Half Yearly", periods: 2 },
    { value: "Yearly", label: "Yearly", periods: 1 }
];

export default function FDCaclulator() {
    const [investment, setInvestment] = useState<string>("");
    const [interestRate, setInterestRate] = useState<string>("");
    const [years, setYears] = useState<string>("");
    const [compoundingFrequency, setCompoundingFrequency] = useState("Monthly");
    const [fdResult, setFdResult] = useState({ maturityAmount: 0, returns: 0 });

    const calculateFD = () => {
        // Parse string inputs to numbers
        const investmentNum = parseFloat(investment);
        const interestRateNum = parseFloat(interestRate);
        const yearsNum = parseFloat(years);

        // Validation: Check if any field is empty or zero
        if (!investment || !interestRate || !years || investmentNum <= 0 || interestRateNum <= 0 || yearsNum <= 0 || compoundingFrequency === "") {
            toast.error("All fields are required and cannot be zero.");
            return;
        }

        // Check if the interest rate exceeds 20%
        if (interestRateNum > 20) {
            toast.error("Interest rate entered can be maximum up to 20%");
            return;
        }

        // Find the selected compounding frequency object
        const selectedFrequency = compoundingFrequencies.find(frequency => frequency.value === compoundingFrequency);
        if (!selectedFrequency) return;

        const rate = interestRateNum / 100;
        const periods = selectedFrequency.periods;
        const totalPeriods = yearsNum * periods;

        // FD Calculation formula: A = P(1 + r/n)^(nt)
        const maturityAmount = investmentNum * Math.pow(1 + rate / periods, totalPeriods);
        const returns = maturityAmount - investmentNum;

        setFdResult({
            maturityAmount: parseFloat(maturityAmount.toFixed(2)),
            returns: parseFloat(returns.toFixed(2)),
        });
    };

    const pieData = [
        { name: "Investment Amount", value: fdResult.returns },
        { name: "Returns", value: fdResult.maturityAmount - fdResult.returns },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">FD Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your FD maturity amount based on investment, interest rate, and compounding frequency.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="investment">FD Investment</Label>
                                <Input
                                    id="investment"
                                    type="number"
                                    value={investment}
                                    onChange={(e) => setInvestment(e.target.value)}
                                    placeholder="Enter FD Investment"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="interestRate">Interest Rate (%)</Label>
                                <Input
                                    id="interestRate"
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Math.min(Number(e.target.value), 20).toString())}
                                    placeholder="Enter Interest Rate"
                                />
                                {parseFloat(interestRate) > 20 && (
                                    <p className="text-red-500 text-sm">Error: Interest rate entered can be maximum up to 20%</p>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="years">Number of Years</Label>
                                <Input
                                    id="years"
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(e.target.value)}
                                    placeholder="Enter Number of Years"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="compoundingFrequency">Compounding Frequency</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-[200px] justify-between">
                                            {compoundingFrequency}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search frequency..." className="h-9" />
                                            <CommandList>
                                                <CommandGroup>
                                                    {compoundingFrequencies.map((option) => (
                                                        <CommandItem
                                                            key={option.value}
                                                            value={option.value}
                                                            onSelect={(currentValue: string) => {
                                                                setCompoundingFrequency(currentValue === compoundingFrequency ? "" : currentValue);
                                                            }}
                                                        >
                                                            {option.label}
                                                            <Check
                                                                className={`ml-auto ${compoundingFrequency === option.value ? "opacity-100" : "opacity-0"}`}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex justify-center mt-4">
                                <Button className="w-full" onClick={calculateFD}>Calculate</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {fdResult.maturityAmount > 0 && (
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Amount at Maturity</TableCell>
                                            <TableCell>{fdResult.maturityAmount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Investment</TableCell>
                                            <TableCell>{investment}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Returns</TableCell>
                                            <TableCell>{fdResult.returns}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                {/* Pie Chart */}
                                <div className="mt-6">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#82ca9d" : "#ff7300"} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}