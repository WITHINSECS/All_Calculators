"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import Wrapper from "@/app/Wrapper"

export default function HRAExemptionCalculator() {
    const [basicSalary, setBasicSalary] = useState(0)
    const [dearnessAllowance, setDearnessAllowance] = useState(0)
    const [hraReceived, setHraReceived] = useState(0)
    const [totalRentPaid, setTotalRentPaid] = useState(0)
    const [isMetro, setIsMetro] = useState(false)
    const [exemption, setExemption] = useState(0)

    const calculateHRAExemption = () => {
        const annualBasicSalary = basicSalary * 12
        const annualDearnessAllowance = dearnessAllowance * 12
        const annualHRAReceived = hraReceived * 12
        const annualRentPaid = totalRentPaid * 12

        const metroFactor = isMetro ? 0.5 : 0.4
        const expectedExemption1 = annualBasicSalary * metroFactor // 50% of basic for metro, 40% for non-metro
        const expectedExemption2 = annualRentPaid - (annualBasicSalary * 0.1) // Rent paid minus 10% of basic
        const expectedExemption3 = annualHRAReceived // Actual HRA received

        const hraExemption = Math.min(expectedExemption1, expectedExemption2, expectedExemption3)
        setExemption(hraExemption)
    }

    const handleCalculate = () => {
        calculateHRAExemption()
    }

    const handleClear = () => {
        setBasicSalary(0)
        setDearnessAllowance(0)
        setHraReceived(0)
        setTotalRentPaid(0)
        setIsMetro(false)
        setExemption(0)
    }

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        HRA exemption calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        How much of my HRA is exempted from tax? Use Pazcare’s HRA calculator to calculate the amount of House Rent Allowance that is non-taxable!


                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="basicSalary">Basic salary received *</Label>
                            <Input
                                id="basicSalary"
                                type="number"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dearnessAllowance">Dearness Allowance *</Label>
                            <Input
                                id="dearnessAllowance"
                                type="number"
                                value={dearnessAllowance}
                                onChange={(e) => setDearnessAllowance(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hraReceived">HRA received *</Label>
                            <Input
                                id="hraReceived"
                                type="number"
                                value={hraReceived}
                                onChange={(e) => setHraReceived(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalRentPaid">Total rent paid *</Label>
                            <Input
                                id="totalRentPaid"
                                type="number"
                                value={totalRentPaid}
                                onChange={(e) => setTotalRentPaid(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <Label>Do you live in Delhi, Mumbai, Kolkata or Chennai? *</Label>
                        <RadioGroup value={isMetro ? "yes" : "no"} onValueChange={(value) => setIsMetro(value === "yes")}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="yes" />
                                <Label htmlFor="yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no">No</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="mt-6">
                        <Button className="p-5 w-full" onClick={handleCalculate}>
                            Calculate Now
                        </Button>
                    </div>
                    {exemption > 0 && (
                        <div className="mt-4 p-4 bg-green-100 rounded">
                            Your HRA exemption is: ₹{exemption.toFixed(2)}
                        </div>
                    )}
                    <div className="mt-4">
                        <Button variant="outline" onClick={handleClear}>Clear</Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}