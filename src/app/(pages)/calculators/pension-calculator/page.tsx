"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper"
export default function PensionCalculator() {
    const [currentAge, setCurrentAge] = useState(30)
    const [currentPensionValue, setCurrentPensionValue] = useState(50000)
    const [oneOffContribution, setOneOffContribution] = useState(0)
    const [personalContribution, setPersonalContribution] = useState(100)
    const [employerContribution, setEmployerContribution] = useState(100)
    const [retireAge, setRetireAge] = useState(66)
    const [targetIncome, setTargetIncome] = useState(50000)
    const [includeStatePension, setIncludeStatePension] = useState(true)
    const [result, setResult] = useState({ retirementIncome: 0, retirementPot: 0 })

    const yearsToRetire = retireAge - currentAge
    const calculateRetirement = () => {
        const monthlyContribution = personalContribution + employerContribution
        const totalMonthlyContributions = monthlyContribution * 12 * yearsToRetire
        const totalOneOff = oneOffContribution
        const growthRate = 0.05 // Assuming 5% annual growth rate
        const futureValue = currentPensionValue * Math.pow(1 + growthRate, yearsToRetire) + totalMonthlyContributions * ((Math.pow(1 + growthRate, yearsToRetire) - 1) / growthRate) + totalOneOff
        const statePension = includeStatePension ? 10000 : 0 // Assuming £10,000 state pension
        const annualIncome = (futureValue * 0.04) + statePension // 4% withdrawal rate
        setResult({
            retirementIncome: annualIncome,
            retirementPot: futureValue
        })
    }

    const handleCalculate = () => {
        calculateRetirement()
    }

    const handleClear = () => {
        setCurrentAge(30)
        setCurrentPensionValue(50000)
        setOneOffContribution(0)
        setPersonalContribution(100)
        setEmployerContribution(100)
        setRetireAge(66)
        setTargetIncome(50000)
        setIncludeStatePension(true)
        setResult({ retirementIncome: 0, retirementPot: 0 })
    }

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Pension Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Your current situation</h3>
                            <div className="space-y-2">
                                <Label htmlFor="currentAge">Current age</Label>
                                <Input
                                    id="currentAge"
                                    type="number"
                                    value={currentAge}
                                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currentPensionValue">Current pension value</Label>
                                <Input
                                    id="currentPensionValue"
                                    type="number"
                                    value={currentPensionValue}
                                    onChange={(e) => setCurrentPensionValue(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="oneOffContribution">One-off contribution</Label>
                                <Input
                                    id="oneOffContribution"
                                    type="number"
                                    value={oneOffContribution}
                                    onChange={(e) => setOneOffContribution(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold">Personal monthly contribution</h3>
                            <div className="space-y-2">
                                <Label htmlFor="personalContribution">Employer monthly contribution</Label>
                                <Input
                                    id="personalContribution"
                                    type="number"
                                    value={personalContribution}
                                    onChange={(e) => setPersonalContribution(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="employerContribution">Employer monthly contribution</Label>
                                <Input
                                    id="employerContribution"
                                    type="number"
                                    value={employerContribution}
                                    onChange={(e) => setEmployerContribution(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold">Your goal</h3>
                            <div className="space-y-2">
                                <Label htmlFor="retireAge">I want to retire at</Label>
                                <Input
                                    id="retireAge"
                                    type="number"
                                    value={retireAge}
                                    onChange={(e) => setRetireAge(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetIncome">With an annual gross of income</Label>
                                <Input
                                    id="targetIncome"
                                    type="number"
                                    value={targetIncome}
                                    onChange={(e) => setTargetIncome(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="includeStatePension">Include state pension</Label>
                                <Switch
                                    id="includeStatePension"
                                    checked={includeStatePension}
                                    onCheckedChange={setIncludeStatePension}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mt-6">

                        {/* Your Pension */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Your pension</h3>
                            <p>
                                Retiring at {retireAge} with your current monthly contribution of £{personalContribution + employerContribution}, your annual income will be {Math.round(result.retirementIncome / 1000)}% off your target
                            </p>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2}><Label>Retirement income (annual):</Label></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Current</TableCell>
                                        <TableCell>£{Math.round(result.retirementIncome)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Target</TableCell>
                                        <TableCell>£{targetIncome}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2}><Label>Retirement pot:</Label></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Current</TableCell>
                                        <TableCell>£{Math.round(result.retirementPot)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Target</TableCell>
                                        <TableCell>£{Math.round(targetIncome / 0.04)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Your Contribution */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Your contribution</h3>
                            <p>
                                By increasing your current monthly contribution and transferring your pension, you'll be able to achieve your target retirement income.
                            </p>

                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><Label>Current monthly contribution of</Label></TableCell>
                                        <TableCell>£{personalContribution + employerContribution}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Label>A new monthly contribution of</Label></TableCell>
                                        <TableCell>
                                            £{(((targetIncome / 0.04) / (yearsToRetire * 12)) - (currentPensionValue / (yearsToRetire * 12))).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <div className="p-4 bg-gray-200 rounded mt-4">
                                <Label>Ideal monthly contribution of</Label>
                                <div className="text-lg font-bold">
                                    £{Math.round((targetIncome / 0.04 - result.retirementPot) / (yearsToRetire * 12))}
                                </div>
                            </div>
                        </div>

                        {/* Your Options */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Your options</h3>

                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><input type="checkbox" /></TableCell>
                                        <TableCell>Lower your target income</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><input type="checkbox" /></TableCell>
                                        <TableCell>Delay your retirement</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><input type="checkbox" /></TableCell>
                                        <TableCell>
                                            Open a pension plan of £{(targetIncome / 0.04 - result.retirementPot) / (yearsToRetire * 12)} to increase your contribution
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><input type="checkbox" /></TableCell>
                                        <TableCell>
                                            Transfer your current pension to Moneyfarm and increase your contribution by £{(targetIncome / 0.04 - result.retirementPot) / (yearsToRetire * 12)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Button className="w-full mt-4">Reach your target with us</Button>
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-6">
                        <Button onClick={handleCalculate}>Calculate</Button>
                        <Button variant="outline" onClick={handleClear}>Clear</Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}