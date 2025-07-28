"use client"
import Wrapper from '@/app/Wrapper'
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
} from "recharts"

const COLORS = ["#000", "#808080"]

const Page = () => {
    const [loanAmount, setLoanAmount] = useState(1000000)
    const [interestRate, setInterestRate] = useState(6.5)
    const [loanTenure, setLoanTenure] = useState(5)

    // Calculate EMI, total interest, and total amount
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTenure * 12
    const monthlyEMI =
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    const totalAmountPayable = monthlyEMI * numberOfPayments
    const totalInterest = totalAmountPayable - loanAmount

    const data = [
        { name: "Principal amount", value: loanAmount },
        { name: "Interest amount", value: totalInterest },
    ]

    // Handle manual input for Loan Amount
    const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value)) setLoanAmount(value)
    }

    // Handle manual input for Interest Rate
    const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value)
        if (!isNaN(value)) setInterestRate(value)
    }

    // Handle manual input for Loan Tenure
    const handleLoanTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value)) setLoanTenure(value)
    }

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
                <h1 className="text-2xl font-semibold lg:text-4xl">
                    Car Loan EMI Calculator
                </h1>
                <p className="text-muted-foreground mt-4 text-xl">
                    Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                </p>
            </div>

            <div className="lg:grid-cols-2 max-w-5xl md:mb-20 mb-10 mt-6 w-full mx-auto grid-cols-1 grid gap-5">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Loan Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Loan amount</Label>
                            <div className="flex items-center gap-4">
                                <p className="text-lg font-semibold">₹ {loanAmount.toLocaleString()}</p>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={handleLoanAmountChange}
                                    className="w-1/3 border p-2 rounded-md"
                                />
                            </div>
                            <Slider
                                value={[loanAmount]}
                                onValueChange={(value) => setLoanAmount(value[0])}
                                max={2000000}
                                step={1000}
                                min={100000}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Rate of interest (p.a)</Label>
                            <div className="flex items-center gap-4">
                                <p className="text-lg font-semibold">{interestRate}%</p>
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={handleInterestRateChange}
                                    className="w-1/3 border p-2 rounded-md"
                                />
                            </div>
                            <Slider
                                value={[interestRate]}
                                onValueChange={(value) => setInterestRate(value[0])}
                                max={15}
                                step={0.1}
                                min={1}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Loan tenure (years)</Label>
                            <div className="flex items-center gap-4">
                                <p className="text-lg font-semibold">{loanTenure} Yr</p>
                                <input
                                    type="number"
                                    value={loanTenure}
                                    onChange={handleLoanTenureChange}
                                    className="w-1/3 border p-2 rounded-md"
                                />
                            </div>
                            <Slider
                                value={[loanTenure]}
                                onValueChange={(value) => setLoanTenure(value[0])}
                                max={10}
                                step={1}
                                min={1}
                            />
                        </div>

                        <p>
                            You can view real-time results based on your selected loan amount, interest rate, and tenure. <br /><br />
                            As you adjust the values, the chart updates instantly to reflect the changes.
                            This visual breakdown helps you understand your monthly payments and total interest.
                            Use the sliders or input fields to customize and see your personalized mortgage summary
                        </p>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Loan Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="value"
                                        labelLine={true}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4 grid grid-cols-2 gap-5 mt-10">
                            <div className="space-y-2">
                                <Label>Monthly EMI</Label>
                                <p className="text-lg font-semibold">
                                    ₹ {isFinite(monthlyEMI) ? monthlyEMI.toLocaleString() : "0"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Principal amount</Label>
                                <p className="text-lg font-semibold">₹ {loanAmount.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Total interest</Label>
                                <p className="text-lg font-semibold">
                                    ₹ {isFinite(totalInterest) ? totalInterest.toLocaleString() : "0"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Total amount</Label>
                                <p className="text-lg font-semibold">
                                    ₹ {isFinite(totalAmountPayable) ? totalAmountPayable.toLocaleString() : "0"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    )
}

export default Page