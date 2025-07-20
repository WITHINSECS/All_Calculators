"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper"

export default function InvestmentCalculator() {
    const [investmentType, setInvestmentType] = useState("lumpsum")
    const [totalInvestment, setTotalInvestment] = useState(25000)
    const [returnRate, setReturnRate] = useState(12)
    const [timePeriod, setTimePeriod] = useState(10)
    const [investedAmount, setInvestedAmount] = useState(0)
    const [estReturns, setEstReturns] = useState(0)
    const [totalValue, setTotalValue] = useState(0)

    const calculateInvestment = () => {
        if (investmentType === "lumpsum") {
            const rate = returnRate / 100;
            const futureValue = totalInvestment * Math.pow(1 + rate, timePeriod);
            setInvestedAmount(totalInvestment);
            setEstReturns(parseFloat((futureValue - totalInvestment).toFixed(2)));
            setTotalValue(parseFloat(futureValue.toFixed(2)));
        }
    };


    const handleCalculate = () => {
        calculateInvestment()
    }

    const handleClear = () => {
        setInvestmentType("lumpsum")
        setTotalInvestment(25000)
        setReturnRate(12)
        setTimePeriod(10)
        setInvestedAmount(0)
        setEstReturns(0)
        setTotalValue(0)
    }

    const data = [
        { name: "Invested amount", value: investedAmount },
        { name: "Est. returns", value: estReturns },
    ]

    const COLORS = ["#000", "#82ca9d"]

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Lumpsum Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        Investments in Mutual Funds can be broadly classified into two types- lumpsum and SIP
                    </p>
                </div>
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex space-x-2 mb-4">
                        <Button
                            variant={investmentType === "sip" ? "default" : "outline"}
                            onClick={() => setInvestmentType("sip")}
                        >
                            SIP
                        </Button>
                        <Button
                            variant={investmentType === "lumpsum" ? "default" : "outline"}
                            onClick={() => setInvestmentType("lumpsum")}
                        >
                            Lumpsum
                        </Button>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="totalInvestment">Total investment</Label>
                                <Input
                                    id="totalInvestment"
                                    type="number"
                                    value={totalInvestment}
                                    onChange={(e) => setTotalInvestment(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="returnRate">Expected return rate (p.a)</Label>
                                <Input
                                    id="returnRate"
                                    type="number"
                                    value={returnRate}
                                    onChange={(e) => setReturnRate(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timePeriod">Time period</Label>
                                <Input
                                    id="timePeriod"
                                    type="number"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                                />
                            </div>

                            <div className="flex space-x-4">
                                <Button onClick={handleCalculate}>Calculate</Button>
                                <Button variant="outline" onClick={handleClear}>Clear</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '16px' }}>
                                        ₹{totalValue}
                                    </text>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount (₹)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Invested Amount</TableCell>
                                    <TableCell className="text-right">₹{investedAmount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Est. Returns</TableCell>
                                    <TableCell className="text-right">₹{estReturns}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Total Value</TableCell>
                                    <TableCell className="text-right font-medium">₹{totalValue}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}