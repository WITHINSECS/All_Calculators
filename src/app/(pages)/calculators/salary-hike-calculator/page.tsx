"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Wrapper from "@/app/Wrapper"

export default function SalaryCalculator() {
    const [currentSalary, setCurrentSalary] = useState(1000)
    const [hikePercentage, setHikePercentage] = useState(10)
    const [newSalary, setNewSalary] = useState("")
    const [result, setResult] = useState("")

    const calculateSalaryByHike = () => {
        const hikeAmount = (currentSalary * hikePercentage) / 100
        setResult(`Your new salary after the hike is: ${Math.round(currentSalary + hikeAmount)}`)
    }

    const calculateHikeBySalary = () => {
        const percentage = ((Number(newSalary) - currentSalary) / currentSalary) * 100
        setResult(`Your hike percentage is: ${percentage.toFixed(2)}%`)
    }

    const handleCalculate = () => {
        if (currentSalary && hikePercentage && !newSalary) {
            calculateSalaryByHike()
        } else if (currentSalary && newSalary) {
            calculateHikeBySalary()
        }
    }

    const handleClear = () => {
        setCurrentSalary(1000)
        setHikePercentage(10)
        setNewSalary("")
        setResult("")
    }

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Salary Hike Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <div className="p-6 max-w-2xl mx-auto">
                    <Tabs defaultValue="salaryByHike" className="w-full">
                        <TabsList className="grid w-full md:grid-cols-2 grid-cols-1">
                            <TabsTrigger value="salaryByHike">Find salary by hike percentage</TabsTrigger>
                            <TabsTrigger value="hikeBySalary">Find hike percentage by salary</TabsTrigger>
                        </TabsList>
                        <TabsContent value="salaryByHike">
                            <div className="space-y-4 md:mt-4 mt-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentSalary">Current Salary :</Label>
                                        <Input
                                            id="currentSalary"
                                            type="number"
                                            value={currentSalary}
                                            onChange={(e) => setCurrentSalary(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hikePercentage">Hike percentage :</Label>
                                        <Input
                                            id="hikePercentage"
                                            type="number"
                                            value={hikePercentage}
                                            onChange={(e) => setHikePercentage(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <Button onClick={handleCalculate}>Calculate</Button>
                                    <Button variant="outline" onClick={handleClear}>Clear</Button>
                                </div>
                                {result && <div className="mt-4 p-4 bg-gray-200 rounded">{result}</div>}
                            </div>
                        </TabsContent>
                        <TabsContent value="hikeBySalary">
                            <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentSalary2">Current Salary :</Label>
                                        <Input
                                            id="currentSalary2"
                                            type="number"
                                            value={currentSalary}
                                            onChange={(e) => setCurrentSalary(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newSalary">New Salary :</Label>
                                        <Input
                                            id="newSalary"
                                            type="number"
                                            value={newSalary}
                                            onChange={(e) => setNewSalary(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <Button onClick={handleCalculate}>Calculate</Button>
                                    <Button variant="outline" onClick={handleClear}>Clear</Button>
                                </div>
                                {result && <div className="mt-4 p-4 bg-gray-200 rounded">{result}</div>}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Wrapper>
    )
}