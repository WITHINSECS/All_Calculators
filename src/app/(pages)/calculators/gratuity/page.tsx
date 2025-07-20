"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import Wrapper from "@/app/Wrapper"

export default function GratuityCalculator() {
    const [salary, setSalary] = useState(0)
    const [years, setYears] = useState(5)
    const [months, setMonths] = useState(0)
    const [totalGratuity, setTotalGratuity] = useState(0)

    const calculateGratuity = () => {
        // Gratuity = (Last drawn salary + DA) * (15/26) * Number of years worked
        const totalService = years + (months / 12)
        const dailyWage = salary / 30
        const gratuity = (dailyWage * 15 / 26) * (totalService * 12)
        setTotalGratuity(Math.round(gratuity))
    }

    const handleCalculate = () => {
        calculateGratuity()
    }

    const handleClear = () => {
        setSalary(0)
        setYears(5)
        setMonths(0)
        setTotalGratuity(0)
    }

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Gratuity calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        The gratuity calculator is a tool that helps you calculate the amount that you will receive after at least five years of work in India
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="salary">Final month's salary + D.A.</Label>
                            <Input
                                id="salary"
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(Number(e.target.value))}
                                placeholder="PKR"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">How long did you work?</Label>
                            <div className="flex space-x-2">
                                <Select value={years.toString()} onValueChange={(value) => setYears(Number(value))}>
                                    <SelectTrigger id="years">
                                        <SelectValue placeholder="0 yrs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 50 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>{i} yrs</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={months.toString()} onValueChange={(value) => setMonths(Number(value))}>
                                    <SelectTrigger id="months">
                                        <SelectValue placeholder="0 mos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>{i} mos</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Total gratuity</Label>
                            <Input
                                id="totalGratuity"
                                type="number"
                                value={totalGratuity}
                                readOnly
                                placeholder="PKR"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex space-x-4">
                        <Button onClick={handleCalculate}>Calculate</Button>
                        <Button variant="outline" onClick={handleClear}>Clear</Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}